# strava-leaderboard
As it is not possible to view a ranking amongst friends within the popular sport app Strava I build a simple leaderboard that uses their API.
The Leaderboard is build with React / Typescript / Shadcn. 

The leaderboard is live at [Strava Leaderboard](https://strava-leaderboard.nikolasschaber.de/) 

The data is visualized using Recharts Charts styled with Shadcn:

![grafik](https://github.com/user-attachments/assets/569bdd0d-920f-4bcd-8577-425af26a4ef8)

Users can connect their accounts to the leaderboard via the OAuth2 authentication, as explained by Strava in the following image:

![getting-started-5](https://github.com/user-attachments/assets/feba57e3-0956-49da-ab8d-3d442951a5f1)

[Source](https://developers.strava.com/docs/authentication/)

Thanks to Stravas Webhooks the application does not permanently request data from Strava but instead is notified whenever a User completes a new activity.

If you withdraw the access of your data to strava-leaderboard in your Strava account settings, the data will automatically deleted from my app :)
