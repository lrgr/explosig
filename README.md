[![Build Status](https://travis-ci.org/lrgr/mutation-signature-explorer.svg?branch=master)](https://travis-ci.org/lrgr/mutation-signature-explorer)

# Mutation Signature Explorer

Hosted: [https://mutation-signature-explorer.lrgr.io/](https://mutation-signature-explorer.lrgr.io/)

### Dependencies
- nodejs
- yarn (`npm install -g yarn`)
- `yarn install`

### Run
[http://localhost:8080](http://localhost:8080)
```
yarn serve
```

### Build
```
yarn build
```

## Examples with pre-selected plots and signatures
Note: requests to generate these plots may result in timeouts on Heroku

- [PCAWG Breast ER+ and HER2- Cancer - EU/UK](http://localhost:8080/#{%22data%22:{%22sources%22:[%22PCAWG-BRCA-EU%22],%22signatures%22:[%22COSMIC%201%22,%22COSMIC%202%22,%22COSMIC%203%22,%22COSMIC%205%22,%22COSMIC%206%22,%22COSMIC%208%22,%22COSMIC%2013%22,%22COSMIC%2017%22,%22COSMIC%2018%22,%22COSMIC%2020%22,%22COSMIC%2026%22,%22COSMIC%2030%22]},%22plots%22:[{%22type%22:%22ExposuresPlot%22,%22options%22:{}},{%22type%22:%22KataegisPlot%22,%22options%22:{}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-BRCA-EU%22,%22donor_id%22:%22DO218605%22}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-BRCA-EU%22,%22donor_id%22:%22DO220824%22}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-BRCA-EU%22,%22donor_id%22:%22DO218173%22}},{%22type%22:%22SignatureGenomeBinsPlot%22,%22options%22:{}}],%22chr%22:{%22value%22:%226%22,%22start%22:0,%22end%22:171115067}})

- [PCAWG Esophageal Adenocarcinoma - UK](http://localhost:8080/#{%22data%22:{%22sources%22:[%22PCAWG-ESAD-UK%22],%22signatures%22:[%22COSMIC%201%22,%22COSMIC%202%22,%22COSMIC%204%22,%22COSMIC%205%22,%22COSMIC%206%22,%22COSMIC%2017%22],%22chromosome%22:%226%22,%22regionWidth%22:1000000},%22plots%22:[{%22type%22:%22ExposuresPlot%22,%22options%22:{}},{%22type%22:%22KataegisPlot%22,%22options%22:{}},{%22type%22:%22SignatureGenomeBinsPlot%22,%22options%22:{}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-ESAD-UK%22,%22donor_id%22:%22DO50307%22}}],%22chr%22:{%22value%22:%226%22,%22start%22:0,%22end%22:171115067}})

- [PCAWG Liver Cancer - NCC, JP](http://localhost:8080/#{%22data%22:{%22sources%22:[%22PCAWG-LINC-JP%22],%22signatures%22:[%22COSMIC%201%22,%22COSMIC%204%22,%22COSMIC%205%22,%22COSMIC%206%22,%22COSMIC%2012%22,%22COSMIC%2016%22,%22COSMIC%2017%22,%22COSMIC%2022%22,%22COSMIC%2023%22,%22COSMIC%2024%22]},%22plots%22:[{%22type%22:%22ExposuresPlot%22,%22options%22:{}},{%22type%22:%22KataegisPlot%22,%22options%22:{}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-LINC-JP%22,%22donor_id%22:%22DO45029%22}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-LINC-JP%22,%22donor_id%22:%22DO45047%22}},{%22type%22:%22RainfallPlot%22,%22options%22:{%22proj_id%22:%22PCAWG-LINC-JP%22,%22donor_id%22:%22DO45051%22}}],%22chr%22:{%22value%22:%224%22,%22start%22:0,%22end%22:191154276}})