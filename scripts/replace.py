#!/usr/bin/python

import sys

for line in sys.stdin.readlines():
    sys.stdout.write(line.replace(sys.argv[1], sys.argv[2]))
