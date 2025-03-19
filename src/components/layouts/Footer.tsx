import { appConfig } from "@/config/app";
import { ModeToggle } from "../mode-toggle";
import Powered from "../../assets/api_logo_pwrdBy_strava_stack_orange.svg"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Footer() {
    return (
        <footer className="py-12">
            <Card className="bg-white p-3 w-full">
                <img src={Powered} alt="Powered by Strava" className="h-10" />
            </Card>
            <div className="hidden">
                <ModeToggle />
            </div>
        </footer>
    )
}