# Mosaic

- Mosaic is a web app for creating social media friendly video edits.
- Mosaic is a port of the popular native app, [Cine-pic](https://apps.apple.com/us/app/cine-pic-photo-video-montage/id923762113).

[https://github.com/user-attachments/assets/e5b8cb93-94c7-41e8-8b78-3eb70b540e53](https://github.com/user-attachments/assets/b4eefe15-9676-4c4f-a6fa-08cd964e05bd
)

## Project Organization
Mosaic is a docker-based and the project is organized by container:
- /mosaic-backend (Express + FFmpeg)
- /mosaic-frontend (React + TypeScript)
- /mosaic-proxy (nginx reverse proxy)


## Running Locally
```
git clone https://github.com/patrick-s-young/mosaic.mobi.git
cd mosaic.mobi/mosaic-api
npm run install
cd ../mosaic-backend
npm run install
cd ../mosaic-frontend
npm run install
```



To build images and run containers, run `docker compose -f docker-compose-dev.yaml up` from the root directory.

To update just the UI, run `npm run dev` from the /mosaic-frontend directory. Note: you will not be able to upload or render new videos.

To update the UI with upload and render enabled, run `docker compose -f docker-compose-frontend-dev.yaml up`from the root directory.

To run the containers on Docker Hub, run `docker compose up`from the root directory.

## Author

* **Patrick Young** - [Patrick Young](https://www.linkedin.com/in/patrick-s-young/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
