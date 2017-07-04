"""
@author: Nicola Gujer
"""

import csv
import json
from io import BytesIO
import os.path

binf = open('Suburb_Evaluer_170301_for_TheSpinoff v2 June update.csv', 'rU')
c = binf.read().decode('utf-8').encode('utf-8')
jsonfile = open(os.path.abspath("data.json"),'w')

for line in csv.DictReader(BytesIO(c)):
    json.dump(line, jsonfile, encoding='utf-8', ensure_ascii=False, indent=0, sort_keys = True)
    jsonfile.write('\n,')
jsonfile.close()