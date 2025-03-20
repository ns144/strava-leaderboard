import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, isWithinInterval } from "date-fns";
import StravaButton from "@/assets/btn_strava_connect_with_orange_x2.svg";
import StravaClaim from "@/api_logo_pwrdBy_strava_stack_orange.svg";
import UserBarChart from "@/components/UserBarChart";
import UserRadialChart from "@/components/UserRadialChart";
import UserSelector from "@/components/UserSelector";

const STRAVA_CLIENT_ID = "152025";
const REDIRECT_URI = `${window.location.origin}/callback`;
const SCOPE = "activity:read";


export default function Dashboard() {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("strava_access_token"));
    const [userStats, setUserStats] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState(userStats[0]?.username || "");

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
                    
                    const runningActivities = activities.filter((act: { type: string; }) => act.type === "Run");
                    console.log(runningActivities);
                    const lastWeekDistance = runningActivities
                        .filter((act: { start_date: string | number | Date; }) => isWithinInterval(new Date(act.start_date), { start: lastWeek, end: now }))
                        .reduce((sum: any, act: { distance: any; }) => sum + act.distance, 0);

                    const lastMonthDistance = runningActivities
                        .filter((act: { start_date: string | number | Date; }) => isWithinInterval(new Date(act.start_date), { start: lastMonth, end: now }))
                        .reduce((sum: any, act: { distance: any; }) => sum + act.distance, 0);

                    const lastMonthElapsedTime = runningActivities
                        .filter((act: { start_date: string | number | Date; }) => 
                            isWithinInterval(new Date(act.start_date), { start: lastMonth, end: now })
                        )
                        .reduce((sum: number, act: { elapsed_time: number }) => sum + act.elapsed_time, 0);
                    
                    const lastMonthPace = lastMonthElapsedTime > 0 ? (lastMonthElapsedTime/60) / (lastMonthDistance/1000) : 0;
                    
                    const lastMonthHeartRates = runningActivities
                        .filter((act: { start_date: string | number | Date; }) => 
                            isWithinInterval(new Date(act.start_date), { start: lastMonth, end: now })
                        )
                        .map((act: { average_heartrate: number }) => act.average_heartrate);
                    
                    const lastMonthHeartRate = lastMonthHeartRates.length > 0 
                        ? lastMonthHeartRates.reduce((sum:number, hr:number) => sum + hr, 0) / lastMonthHeartRates.length 
                        : 0;


                    return {
                        username: user.profile?.firstName + " " + user.profile?.lastName,
                        profilePicture: user.profile?.profilePicture,
                        pr_times: prTimes,
                        all_run_distance: user.stats?.all_run_totals?.distance,
                        ytd_run_distance: user.stats?.ytd_run_totals?.distance,
                        recent_run_distance: user.stats?.recent_run_totals?.distance,
                        last_week_distance: lastWeekDistance,
                        last_month_distance: lastMonthDistance,
                        latest_pace: lastMonthPace,
                        latest_hr: lastMonthHeartRate,
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
                            title="Last Week"
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
                            title="Last Month"
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
                            title="This Year"
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
                            title="Total"
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
                    <CardTitle className="text-2xl">Latest Trainings</CardTitle>
                    <CardDescription>Statistics based on last months runs</CardDescription>
                </CardHeader>
                <div className="p-4 space-y-6">
                    {userStats.length > 0 ? (
                        <>
                            <UserSelector data={userStats} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                            <div className="flex sm:flex-row gap-6 items-center flex-col">
                            <UserRadialChart
                                        data={userStats.map(user => ({
                                            username: user.username,
                                            profilePicture: user.profilePicture,
                                            value: user.latest_hr,
                                        }))}
                                        title="Average Heartrate"
                                        dataKey="value"
                                        unit="bpm"
                                        color="hsl(var(--chart-1))"
                                        selectedUser={selectedUser}
                                        maxValue={240}
                                    />
                            <UserRadialChart
                                        data={userStats.map(user => ({
                                            username: user.username,
                                            profilePicture: user.profilePicture,
                                            value: user.latest_pace,
                                        }))}
                                        title="Average Pace"
                                        dataKey="value"
                                        unit="min/km"
                                        color="hsl(var(--chart-1))"
                                        selectedUser={selectedUser}
                                        maxValue={12}
                                    />
                            </div>
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
