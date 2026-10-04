import subprocess
import re


def scan_target(target: str):
    result = subprocess.run(
        ["nmap", "-sV", target],
        capture_output=True,
        text=True
    )

    output = result.stdout

    ports = []

    for line in output.splitlines():
        match = re.match(
            r"(\d+)/tcp\s+open\s+(\S+)(?:\s+(.*))?",
            line
        )

        if match:
            ports.append({
                "port": int(match.group(1)),
                "service": match.group(2),
                "version": match.group(3) or "Unknown"
            })

    return {
        "target": target,
        "ports": ports
    }