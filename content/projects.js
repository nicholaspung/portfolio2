export default [
  {
    title: "Dashboard API",
    date: "2019-08-12",
    draft: true,
    category: ["Javascript", "Node", "Express", "Mongoose", "MongoDB"],
    github: "https://github.com/nicholaspung/dashboard-backend",
    website: "https://dashboard-backend-swagger-api.herokuapp.com/",
    description:
      "Dashboard API is the REST client for Dashboard. Current tools created are a todo list and a habit tracker. In addition to the technologies used, Dashboard API was built using PassportJS and SwaggerUI.",
    picture: {
      src: "./dashboard-b.png",
      alt: "Picture of SwaggerUI documentation",
    },
    order: 2,
  },
  {
    title: "Emaily",
    date: "2019-07-12",
    draft: false,
    category: [
      "Javascript",
      "React",
      "Node",
      "Express",
      "Mongoose",
      "MongoDB",
      "Passport",
    ],
    github: "https://github.com/nicholaspung/emaily",
    website: "https://send-emaily-to-users.herokuapp.com/",
    description:
      "Emaily is an application for product owners to send out emails to users for feedback. In addition to the technologies used, Emaily was built using PassportJS, SendGrid API, Stripe API, Axios, React Router, MaterializeCSS.",
    picture: {
      src: "./emaily.png",
      alt:
        "⬆️ (Top Half) Surveys Sent Dashboard | ⬇️ (Bottom Half) Sending out a survey",
    },
    order: 1,
  },
  // {
  //   title: "Prod VaLid",
  //   date: "2019-09-30",
  //   draft: false,
  //   category: ["Javascript", "React", "Redux", "Node", "Express", "PostgreSQL"],
  //   github: "https://github.com/labs15-lambda-next/frontend",
  //   website: "https://prod-valid.netlify.com/",
  //   description:
  //     "Prod VaLid is an application to validate problems through crowdsourcing. It was made in a team of 6 in 2 months, completing 2 product cycles. My main responsibilities were to design/code the front end UI, doing code reviews of other's code, and fixing functionality throughout the site.",
  //   picture: {
  //     src: "./prod-valid.png",
  //     alt: "Picture of front page for Prod VaLid",
  //   },
  //   order: 3,
  // },
  {
    title: "Your Toolbox",
    date: "2020-04-20",
    draft: false,
    category: ["Javascript", "React", "Firebase"],
    github: "https://github.com/nicholaspung/productivity-app",
    website: "https://productivity-app-dev.firebaseapp.com",
    description:
      "Your Toolbox is a habit tracker and to-do list. The goal for this project was to create a light-weight version of Habitica which only contained essential features that I used. Other technologies used are: Emotion, Firebase Auth, Firebase Cloud Firestore, PWA",
    picture: {
      src: "./prod-valid.png",
      alt: "Picture of front page for Prod VaLid",
    },
    order: 4,
    slug: "your-toolbox",
  },
  {
    title: "MD Writer",
    date: "2020-05-20",
    draft: false,
    category: ["Javascript", "Electron"],
    github: "https://github.com/nicholaspung/md-writer",
    description:
      "MD Writer is a text editor that displays how markup is displayed. The goal of this project was to create a light-weight application for me to write blog posts for my website.",
    picture: {
      src: "",
      alt: "",
    },
    order: 5,
    slug: "md-writer",
  },
  {
    title: "Distraction Free",
    date: "2020-07-14",
    draft: false,
    category: [
      "Javascript",
      "Vue",
      "VueX",
      "Auth0",
      "Node",
      "Express",
      "SQLite3",
      "Swagger-UI",
    ],
    github: [
      "https://github.com/nicholaspung/distraction-free-fe",
      "https://github.com/nicholaspung/distraction-free-api",
    ],
    website: "https://nicholaspung.github.io/distraction-free-fe/",
    description:
      "Distraction Free is an application to help minimize the urge to check Reddit for posts that contain a particular title. The goal of this project was to create a minimally aesthetic application to deter users from checking often, while also not feeling left out by specific Reddit Posts.",
    picture: {
      src: "",
      alt: "",
    },
    order: 6,
    slug: "distraction-free",
  },
]
