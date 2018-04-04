### API

POST: `/signature-genome-bins`
```
{
	"regionWidth": 5000000,
	"chromosome": "1",
	"sigSource": "cosmic",
	"activityLevel": "all",
	"ssmSources": ["PCAWG-PRAD-UK"]
}
```

POST: `/signatures`
```
{
	"sigSource": "cosmic"
}
```

POST: `/signatures-per-cancer`
```
{
	"sigSource": "cosmic"
}
```

POST: `/data-listing`
```
{ }
```
