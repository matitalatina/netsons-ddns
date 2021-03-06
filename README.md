# Netsons DDNS

**[Update 2020-06-09]** *Netsons added [Google reCAPTCHA](https://www.google.com/recaptcha/intro/v3.html) on login page. So my app fails to login. I think there's no quick solution to overcome this issue. I'm open to pull requests if someone finds a solution.*
*In the meantime, I switched my DDNS to [namecheap](https://www.namecheap.com/). [It's waaaay easier](https://www.namecheap.com/support/knowledgebase/article.aspx/29/11/how-do-i-use-a-browser-to-dynamically-update-the-hosts-ip) to keep DNS updated.*

This projects aim to handle a DDNS using the domain provider Netsons.
Unfortunately, Netsons doesn't expose any API to keep updated the DNS records. So I created this project.

## Why you should use this application

If you have this situation like mine:

- You have a dynamic IP assigned from your internet provider.
- You have a domain handled by Netsons.
- You want to keep updated an `A` DNS record in order to point always to your dynamic IP.

## Requirements

- Node.js installed.
- The `A` DNS record already existing on Netsons. It keeps updated, but it doesn't create it.

## Getting Started

- Clone this project.
- Go to the project root.
- `npm install`: it installs the project dependencies.
- `npm run build`: it builds the Node.Js app in the `dist/` folder.
- You need to put the `.env` file inside the `dist/` folder to add your configuration. You can see an example inside `.env.example` file.
  You can avoid this step. You should provide those parameters inside your environment when you run the app.
- `node dist/index.js` to start it.

## How it works

This is the flow that follows:

- Login on netsons website. Fetch the required cookies.
- Download HTML page of your domain management page.
- Parse your DNS records and find the entry you want to edit.
- Update the entry record.

## FAQ

- *Where can I find `NETSONS_DOMAIN_ID` environment variable?* You can find it in the netsons URL, when you are on your domain page edit.
  `https://www.netsons.com/manage/index.php?m=pdns&domainid=<YOUR_DOMAIN_ID>`.
