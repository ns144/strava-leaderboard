import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, isWithinInterval } from "date-fns";
import StravaButton from "@/assets/btn_strava_connect_with_orange_x2.svg";
import StravaClaim from "@/api_logo_pwrdBy_strava_stack_orange.svg";
import UserBarChart from "@/components/UserBarChart";

const STRAVA_CLIENT_ID = "152025";
const REDIRECT_URI = `${window.location.origin}/callback`;
const SCOPE = "activity:read";


export default function Dashboard() {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("strava_access_token"));
    const [userStats, setUserStats] = useState<any[]>([]);

    const handleStravaLogin = () => {
        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}&approval_prompt=force`;
        window.location.href = authUrl;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map(doc => doc.data());
                console.log("Fetched Users Data:", usersData);

                const now = new Date();
                const lastWeek = subDays(now, 7);
                const lastMonth = subDays(now, 30);

                const userStatsData = usersData.map(user => {
                    const prTimes = user.pr?.Run || {};
                    const activities = user.activities || [];
                    
                    const runningActivities = activities.filter(act => act.type === "Run");
                    console.log(runningActivities);
                    const lastWeekDistance = runningActivities
                        .filter(act => isWithinInterval(new Date(act.start_date), { start: lastWeek, end: now }))
                        .reduce((sum, act) => sum + act.distance, 0);

                    const lastMonthDistance = runningActivities
                        .filter(act => isWithinInterval(new Date(act.start_date), { start: lastMonth, end: now }))
                        .reduce((sum, act) => sum + act.distance, 0);

                    return {
                        username: user.profile?.firstName + " " + user.profile?.lastName,
                        profilePicture: user.profile?.profilePicture,
                        pr_times: prTimes,
                        all_run_distance: user.stats?.all_run_totals?.distance,
                        ytd_run_distance: user.stats?.ytd_run_totals?.distance,
                        recent_run_distance: user.stats?.recent_run_totals?.distance,
                        last_week_distance: lastWeekDistance,
                        last_month_distance: lastMonthDistance,
                    };
                });

                setUserStats(userStatsData);
                console.log("User Stats:", userStatsData);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchData();
    }, []);

    

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Leaderboard</PageHeaderHeading>
            </PageHeader>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Add your Strava data</CardTitle>
                    <CardDescription>Connect your Strava Account to add your data to the Leaderboard.</CardDescription>
                </CardHeader>
                <button onClick={handleStravaLogin} className="border-none bg-transparent p-0 m-6">
                    <img src={StravaButton} alt="Connect with Strava" className="h-12 w-auto cursor-pointer" />
                </button>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Running Activity</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <div className="p-4 space-y-6">
                    {userStats.length > 0 ? (
                        <>
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.last_week_distance/1000,
                            }))}
                            title="Last Week Running Distances"
                            dataKey="value"
                            unit="kilometers"
                            color="hsl(var(--chart-1))"
                        />
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.last_month_distance/1000,
                            }))}
                            title="Last Month Running Distances"
                            dataKey="value"
                            unit="kilometers"
                            color="hsl(var(--chart-1))"
                        />
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.ytd_run_distance/1000,
                            }))}
                            title="This Year Running Distances"
                            dataKey="value"
                            unit="kilometers"
                            color="hsl(var(--chart-1))"
                        />
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.all_run_distance/1000,
                            }))}
                            title="Complete Running Distances"
                            dataKey="value"
                            unit="kilometers"
                            color="hsl(var(--chart-1))"
                        />
                        </>
                    ) : (
                        <p>Loading activities...</p>
                    )}                    
                </div>
            </Card>
            <Card className="mt-12">
                <CardHeader>
                    <CardTitle className="text-2xl">Breaking Records</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <div className="p-4 space-y-6">
                    {userStats.length > 0 ? (
                        <>
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.pr_times["1000"]?.elapsedTime/60 || 0,
                            }))}
                            title="1KM PR"
                            dataKey="value"
                            unit="minutes"
                            color="hsl(var(--chart-1))"
                        />
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.pr_times["5000"]?.elapsedTime/60 || 0,
                            }))}
                            title="5KM PR"
                            dataKey="value"
                            unit="minutes"
                            color="hsl(var(--chart-1))"
                        />
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.pr_times["10000"]?.elapsedTime/60 || 0,
                            }))}
                            title="10KM PR"
                            dataKey="value"
                            unit="minutes"
                            color="hsl(var(--chart-1))"
                        />
                        <UserBarChart
                            data={userStats.map(user => ({
                                username: user.username,
                                profilePicture: user.profilePicture,
                                value: user.pr_times["21000"]?.elapsedTime/60 || 0,
                            }))}
                            title="21KM PR"
                            dataKey="value"
                            unit="minutes"
                            color="hsl(var(--chart-1))"
                        />
                        </>
                    ) : (
                        <p>Loading activities...</p>
                    )}                    
                </div>
            </Card>
        </>
    );
}
