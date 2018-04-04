from sanic import Sanic, response
from constants import *
from validation_utils import *
from plot_processing import PlotProcessing

app = Sanic()

HEADERS = { 'Access-Control-Allow-Origin': '*' }

@app.post('/signature-genome-bins')
async def route_signature_genome_bins(req):
  print(req.body)
  region_width = int(json_or(req, 'regionWidth', 1000000, r'^\d+$'))
  chromosome = str(json_or(req, 'chromosome', "1", CHROMOSOME_RE))
  sig_source = json_or(req, 'sigSource', "cosmic", r'^[a-zA-Z0-9]+$')
  activity = json_or(req, 'activityLevel', "all", r'^(all|active)$')
  projects = json_or(req, 'ssmSources', ["PCAWG-BRCA-EU", "PCAWG-LIHC-US"], PROJ_RE)

  output = PlotProcessing.muts_by_sig_points(region_width, chromosome, sig_source, activity, projects)

  return response.text(output, headers=HEADERS)

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

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000)
