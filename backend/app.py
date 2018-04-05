from sanic import Sanic, response
from web_constants import *
from validation_utils import *
from plot_processing import PlotProcessing
import json

app = Sanic()

@app.post('/signature-genome-bins')
async def route_signature_genome_bins(req):
  region_width = int(json_or(req, 'regionWidth', 1000000, r'^\d+$'))
  chromosome = str(json_or(req, 'chromosome', "1", CHROMOSOME_RE))
  signatures = json_or(req, 'signatures', ["COSMIC 1"], r'.*')
  projects = json_or(req, 'sources', ["PCAWG-BRCA-EU", "PCAWG-LIHC-US"], PROJ_RE)

  output = PlotProcessing.muts_by_sig_points(region_width, chromosome, signatures, projects)
  length = str.encode(output)
  header = HEADERS
  header['Content-Length'] = length
  return response.text(output, headers=header, content_type='text/csv')

@app.post('/kataegis')
async def route_kataegis(req):
  chromosome = str(json_or(req, 'chromosome', "1", CHROMOSOME_RE))
  projects = json_or(req, 'sources', ["PCAWG-BRCA-EU", "PCAWG-LIHC-US"], PROJ_RE)

  output = PlotProcessing.kataegis(chromosome, projects)
  length = str.encode(output)
  header = HEADERS
  header['Content-Length'] = length
  return response.text(output, headers=header, content_type='text/csv')

@app.post('/signatures')
async def route_signatures(req):
  sig_source = json_or(req, 'sigSource', "cosmic", r'^[a-zA-Z0-9]+$')
  output = PlotProcessing.sigs(sig_source)
  return response.text(output, headers=HEADERS)

@app.post('/signatures-per-cancer')
async def route_signatures_per_cancer(req):
  sig_source = json_or(req, 'sigSource', "cosmic", r'^[a-zA-Z0-9]+$')
  output = PlotProcessing.sigs_per_cancer(sig_source)
  return response.text(output, headers=HEADERS)

@app.post('/data-listing')
async def route_data_listing(req):
  output = PlotProcessing.data_listing_json()
  return response.json(output, headers=HEADERS)

@app.post('/chromosomes')
async def route_chromosome(req):
  output = json.dumps(CHROMOSOMES)
  length = str.encode(output)
  header = HEADERS
  header['Content-Length'] = length
  return response.text(output, headers=HEADERS, content_type='application/json')

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000)
