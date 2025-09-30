AquaNova – Real-Time Groundwater Monitoring App

Problem statement:- Groundwater is central to India’s drinking water, agriculture, and industry. Despite covering 3.3 million sq. km and housing 16% of the world’s population, India has only 4% of global freshwater resources. Overexploitation, uneven distribution, and climate variability make sustainable groundwater management critical.

AquaNova is a web-based prototype that visualizes groundwater data from a sample dataset inspired by DWLR stations:
1.Monitor simulated groundwater level trends
2.Estimate recharge dynamically using sample data
3.Provide simple dashboards for research and decision-making
4.Demonstrates a subscription model for different prediction horizons

Note: This prototype does not use live DWLR data. Sample datasets are used to demonstrate features and functionality.

Key Features
1.Interactive charts and graphs using JavaScript
2.List of stations with sample water levels
3.Responsive frontend with HTML & CSS
4.Dynamic updates and interactivity using vanilla JavaScript
5.Subscription-based access simulation for predictive analytics

Screenshots included for demo purposes

Subscription Model (Sample Implementation)
Free: 1-year groundwater level prediction
Pro: 5-year prediction
Enterprise: 7-year prediction

This is a frontend prototype showing how subscriptions could restrict access to different prediction horizons. All predictions are generated from sample data.

Tech Stack
Frontend: HTML, CSS, JavaScript
Charts & Visualization: Chart.js (or vanilla JS)
Backend: None (local prototype / simulated data)

Future Work
- Integrate real DWLR datasets for real-time monitoring
- Add backend with database to store user subscriptions and prediction history
- Mobile app version for Android and iOS
- Advanced predictive analytics using AI/ML for groundwater trends
- User authentication and personalized dashboards

How It Works
1. Sample dataset simulates groundwater levels for multiple stations.
2. JavaScript generates charts and trend visualizations dynamically.
3. Subscription model simulates tiered access to predictions:
   - Free: 1-year predictions
   - Pro: 5-year predictions
   - Enterprise: 7-year predictions
4. Users can interact with charts and switch subscription tiers to see different predictions.


Known Limitations
- Uses only sample datasets; no live DWLR integration yet
- Predictions are simulated, not based on real data
- No backend database; all functionality runs in the browser
- Subscription model is frontend simulation only
