import pandas as pd

# where active.tsv with first col "abbreviation" and other columns signature names/numbers for the cancer type row
df = pd.read_csv("active.tsv", sep='\t') 

df_active = pd.DataFrame(index=list(df.index.values), columns=["abbreviation"] + list(map(str, range(1, 31))))

for index in list(df.index.values):
	df_active.loc[index, "abbreviation"] = df.loc[index, "abbreviation"]
	for colindex in range(0, len(list(df.columns.values))):
		if colindex >= 1:
			if df.iloc[index, colindex] > 0:
				print(colindex)
				df_active.iloc[index, int(df.iloc[index, colindex])] = 1

df_active.fillna(value=0, inplace=True)
df_active.to_csv("active_binary.tsv", sep='\t', index=False)