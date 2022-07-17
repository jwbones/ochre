ochre is a desktop app to do rough translations of images

setup:
1. get yourself a service key for google cloud services

    the project needs the image ocr and translation apis enabled

    google has much better instructions than I do for this

2. get yourself an api key for deepl

    the free tier should be fine

    since you are using real api keys, if you use this tool heavily you might have to pay them. the free tiers are pretty generous for this use case, ocr is 1000 images a month and the translation are 250k characters / month.

3. once you have the google token and deepl api key, stick the google token in the root folder for the app and fill out the .env
    
    the path to the google token goes under `GOOGLE_APPLICATION_CREDENTIALS`
    and the raw api key goes under `deepl_api_key`

once setup is complete, run the app, paste in some images, and start browsing!