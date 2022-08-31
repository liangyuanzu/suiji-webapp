# suiji-webapp
Suiji-webapp is a smart todo-list tool.
<br>

## Features

- ⚡️ Account & Security

  It includes operations related to registration, login, logout, and forgetting passwords. Among them, registration and login are mainly simplified, and only the login method of account and password is provided.

- 🗂 List management

  Including additions, deletions, modifications, and inspections of lists.

- 📦 Task management

  Including adding, deleting, modifying and checking tasks, setting execution time, setting reminder time, and task reminder operations.
  - Different tasks can be set in one list.
  - The tasks are independent of each other, and the execution time and reminder time can be set separately.

- 🍍 Calendar view

  View tasks set for the current month or other months.

<br>

## Usage

### Development

Just run and visit http://localhost:3333

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

And you will see the generated file in `dist` that ready to be served.

### Deploy on Netlify

Go to [Netlify](https://app.netlify.com/start) and select your clone, `OK` along the way, and your App will be live in a minute.

## Why
In fact, many users urgently need a good tool that can help them improve their execution and help them manage their time. To this end, I decided to develop a drop-off list platform. This platform needs to have functions such as to-do record, calendar view, time reminder, etc., so that users can more conveniently and efficiently record to-do items at any time, and remind them at a set time, which can stimulate users to act immediately. The effect is to urge users to complete the established plan, improve the user's execution, and solve the user's pain points.
