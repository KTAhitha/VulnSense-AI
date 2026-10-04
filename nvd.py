import requests
import re


NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"
NVD_CPE_API = "https://services.nvd.nist.gov/rest/json/cpes/2.0"


def clean_version(version):
    """
    Extract numeric version from values such as:

    MySQL 8.0.46
    mysql 3.23.33
    8.0.46
    """

    match = re.search(r"\d+(?:\.\d+)+", str(version))

    if match:
        return match.group(0)

    return str(version)


def version_to_tuple(version):
    """
    Convert a version into a tuple.

    Example:

    8.0.46
    -> (8, 0, 46)

    MySQL 8.0.46
    -> (8, 0, 46)
    """

    version = clean_version(version)

    parts = version.split(".")

    result = []

    for part in parts:

        number = ""

        for char in part:

            if char.isdigit():
                number += char

            else:
                break

        if number:
            result.append(int(number))

    return tuple(result)


def version_in_range(
    version,
    start_including=None,
    start_excluding=None,
    end_including=None,
    end_excluding=None
):

    v = version_to_tuple(version)

    if start_including:

        if v < version_to_tuple(start_including):
            return False

    if start_excluding:

        if v <= version_to_tuple(start_excluding):
            return False

    if end_including:

        if v > version_to_tuple(end_including):
            return False

    if end_excluding:

        if v >= version_to_tuple(end_excluding):
            return False

    return True


def extract_cpe_version(cpe):
    """
    Extract version from a CPE.

    Example:

    cpe:2.3:a:oracle:mysql:3.23.33:...

    returns:

    3.23.33
    """

    parts = cpe.split(":")

    if len(parts) >= 6:
        return parts[5]

    return None


def search_cves_for_version(product, version):

    params = {
        "keywordSearch": product,
        "resultsPerPage": 50
    }

    response = requests.get(
        NVD_API_URL,
        params=params,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    vulnerabilities = []

    detected_version = clean_version(version)

    for item in data.get("vulnerabilities", []):

        cve = item.get("cve", {})

        cve_id = cve.get("id")

        descriptions = cve.get("descriptions", [])

        description = ""

        for desc in descriptions:

            if desc.get("lang") == "en":

                description = desc.get("value", "")

                break

        affected = False

        for config in cve.get("configurations", []):

            for node in config.get("nodes", []):

                for match in node.get("cpeMatch", []):

                    criteria = match.get(
                        "criteria",
                        ""
                    ).lower()

                    # Only consider Oracle MySQL
                    if ":oracle:mysql:" not in criteria:
                        continue

                    # -----------------------------------------
                    # CASE 1: Exact CPE version
                    # -----------------------------------------

                    cpe_version = extract_cpe_version(
                        criteria
                    )

                    if cpe_version:

                        # Ignore wildcard-only CPEs.
                        # We need actual version/range information.
                        if cpe_version == "*":
                            pass

                        else:

                            if (
                                version_to_tuple(cpe_version)
                                == version_to_tuple(detected_version)
                            ):
                                affected = True
                                break

                    # -----------------------------------------
                    # CASE 2: Version ranges
                    # -----------------------------------------

                    start_including = match.get(
                        "versionStartIncluding"
                    )

                    start_excluding = match.get(
                        "versionStartExcluding"
                    )

                    end_including = match.get(
                        "versionEndIncluding"
                    )

                    end_excluding = match.get(
                        "versionEndExcluding"
                    )

                    has_range = (
                        start_including
                        or start_excluding
                        or end_including
                        or end_excluding
                    )

                    if has_range:

                        if version_in_range(
                            detected_version,
                            start_including,
                            start_excluding,
                            end_including,
                            end_excluding
                        ):

                            affected = True
                            break

                if affected:
                    break

            if affected:
                break

        if affected:

            vulnerabilities.append({

                "cve_id": cve_id,

                "description": description

            })

    return vulnerabilities


def find_mysql_cpe(version: str):

    params = {
        "keywordSearch": f"MySQL {version}",
        "resultsPerPage": 100
    }

    response = requests.get(
        NVD_CPE_API,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    matches = []

    for product in data.get("products", []):

        cpe = product.get("cpe", {})

        cpe_name = cpe.get(
            "cpeName",
            ""
        )

        if ":oracle:mysql:" in cpe_name.lower():

            matches.append(cpe_name)

    return matches