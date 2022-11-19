# Seventy Two Seasons

## Usage

1. Install dependencies
    ```bash
    npm install
    ```
    
2. Create a file called `config.json` and copy in the following JSON:
    ```
    {
    "ENDPOINT": "https://localhost/graphql",
    "KO_SCHEMA_ID": "",
    "SEKKI_SCHEMA_ID": "",
    "YEAR_SCHEMA_ID": "",
    "YEAR_ID": ""
    }
    ```
3. Start your [`aquadoggo`](https://github.com/p2panda/aquadoggo) node
4. Deploy schemas on node
    ```bash
    npm run schema
    ```
5. Copy the resulting JSON into `config.json`
6. Publish a year document to node
    ```bash
    npm run year
    ```
7. Copy the resulting JSON into `config.json`
8. Start the application
    ```bash
    npm start
    ```
9. Open the webbrowser at http://localhost:8080

## License

`UNLICENSED`