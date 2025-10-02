AquaNova – Real-Time Groundwater Monitoring App (Prototype)

Problem Statement

Groundwater is central to India’s drinking water, agriculture, and industry. Despite covering 3.3 million sq. km and housing 16% of the world’s population, India has only 4% of global freshwater resources. Overexploitation, uneven distribution, and climate variability make sustainable groundwater management critical.

AquaNova is a web-based prototype that visualizes groundwater data from a sample dataset inspired by DWLR stations, demonstrating interactive monitoring, predictive insights, and user-specific recommendations.

Key Features
- Interactive Dashboard:
	- Monitor simulated groundwater level trends across states and districts.
	- Estimate recharge dynamically using sample data.
	- Metrics cards showing Net Availability, Annual Draft, Stage of Development, and Projected Demand.
	- User-Specific Insights:
	- Tailored insights for different user types: Policymakers, Researchers, and Planners.
	- Insights generated dynamically based on the selected district’s data and current predictions.
	- Prediction Simulation:
	- Visualize historical groundwater data and predicted trends for future years.
- Tiered subscription model controls prediction horizons:
   - Free: 1-year prediction
   - Pro: 5-year prediction
   - Enterprise: 7-year prediction
- Subscription Simulation:
  - Demonstrates different access levels with active plan display.
  - UI dynamically updates charts and metrics based on the selected plan.
- Interactive Selection:
  - Users select State, District, and User Type to generate relevant metrics, predictions, and insights.
  - Charts are generated using Chart.js with animated trends and noise to simulate real-world variability.
- Frontend Technology:
  - HTML, CSS, and vanilla JavaScript for a responsive, interactive interface.
  - No backend required; all functionality runs in the browser using sample datasets.

How It Works
- Users select State, District, and User Type on the Home screen.
- Predictions Section displays:
- Metrics cards for key groundwater indicators.
- Historical and predicted groundwater trends (dynamic chart).
- Active subscription plan affecting prediction horizon.
- Insights Section provides user-specific recommendations based on simulated metrics.
- Users can switch subscription tiers to see changes in prediction availability and metrics.

Note: This is a working prototype using sample datasets only. No official DWLR data has been used to train the predictive model. All predictions and insights are simulated to demonstrate functionality, not actual groundwater conditions.

Future Work
- Integrate real-time DWLR datasets for accurate monitoring.
- Backend implementation for user authentication, subscription tracking, and historical prediction storage.
- Mobile app version for Android and iOS.
- Advanced predictive analytics using AI/ML for groundwater trend forecasting.
- Expand insights and metrics with more environmental and regional parameters.

Tech Stack
- Frontend: HTML, CSS, JavaScript
- Charts & Visualization: Chart.js
- Backend: None (local prototype / simulated data)

Known Limitations
- Uses only sample datasets; no live DWLR integration.
- Predictions are simulated, not based on real-world data.
- No backend database; all functionality runs in the browser.
- Subscription model is a frontend simulation only.
   
