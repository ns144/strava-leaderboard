interface AppConfig {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfig = {
    name: "Leaderboard",
    github: {
        title: "Leaderboard",
        url: "https://github.com/hayyi2/react-shadcn-starter",
    },
    author: {
        name: "hayyi",
        url: "https://github.com/hayyi2/",
    }
}