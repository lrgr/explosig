from sanic import Sanic, response
from constants import *
from plot_processing import PlotProcessing

app = Sanic()

PlotProcessing.load()

@app.post('/signature-genome-bins')
async def signature_genome_bins(req):
  try:
    region_width = req.json['region_width']
    selected_signatures = req.json['selected_signatures']
    selected_projects = req.json['selected_projects']
  except KeyError:
    region_width = 1000000
    selected_signatures = [("COSMIC_%d" % i) for i in list(range(1, 31))]
    selected_projects = ['ALL-US', 'BRCA-US']

  output = PlotProcessing.muts_by_sig_points(region_width, selected_signatures, selected_projects)

  return response.raw(output.getvalue())

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000)
