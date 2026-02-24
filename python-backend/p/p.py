from nsetools import Nse
nse = Nse()
gainers = nse.get_gainers()   # or similar function - check docs
losers  = nse.get_losers()
print("Gainers:", gainers)
print("Losers:", losers)
