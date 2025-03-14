import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const STRAVA_CLIENT_ID = "152025"; // Replace with your Strava Client ID
const STRAVA_CLIENT_SECRET = "00a8704e44dc32d2b01d1662cd09471100f2099d"; // Adjust scopes as needed
const FIREBASE_FUNCTION_URL = "https://storestravatoken-kyn5wmvykq-uc.a.run.app";

export default function Callback() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const navigate = useNavigate();

    useEffect(() => {
        if (code) {
            fetch("https://www.strava.com/oauth/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: STRAVA_CLIENT_ID,
                    client_secret: STRAVA_CLIENT_SECRET,
                    code,
                    grant_type: "authorization_code",
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    console.log("Strava Access Token:", data.access_token);
                    
                    if (data.access_token && data.access_token!=undefined) {
                        localStorage.setItem("strava_access_token", data.access_token);

                        // Send token to Firebase Cloud Function
                        fetch(FIREBASE_FUNCTION_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: String(data.athlete.id),
                                accessToken: data.access_token,
                                refreshToken: data.refresh_token,
                                expiresAt: data.expires_at,
                            }),
                        })
                        .then(() => console.log("Token stored in Firestore"))
                        .catch(err => console.error("Error saving token:", err));
                    }
                    
                    setTimeout(() => navigate("/"), 2000);
                })
                .catch(err => {
                    console.error("OAuth Error:", err);
                    setTimeout(() => navigate("/"), 2000); // Redirect even on failure
                });
        }
    }, [code]);

    return <p>Processing authentication...</p>;
}
