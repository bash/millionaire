#!/usr/bin/python

import hashlib
import sys
import json
import os

files = sys.argv[1:]
files_map = {}

for file_name in files:
    with open(file_name, 'r') as f:
        content = f.read()

    file_hash = hashlib.sha1(content).hexdigest()
    file_id = file_hash[:10]
    (name, ext) = os.path.splitext(file_name)

    basename = os.path.splitext(os.path.basename(file_name))[0]

    files_map[basename] = basename + '-' + file_id


print json.dumps(files_map)
