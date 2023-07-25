Running Front End application.

Please git clone my repository with correct url
(git clone https://github.com/thakoreh/eval2023.git)

I have used ReactJS in Front end application.

after cloning, get into the folder, firstly remove backend folder out of that cloned folder as it is backend server. I have a details below how to run that as well.



once you are into the folder, we need to install dependencies for our node. Make sure you have already installed NodeJs. Ctrl+~ will open terminal where you need to paste below command:

npm install @emotion/react@^11.11.1 @emotion/styled@^11.11.0 @fontsource/roboto@^5.0.5 @mui/icons-material@^5.14.1 @mui/material@^5.14.1 @mui/styled-engine-sc@^5.12.0 @testing-library/jest-dom@^5.17.0 @testing-library/react@^13.4.0 @testing-library/user-event@^13.5.0 cors@^2.8.5 particles-bg@^2.5.5 qrcode.react@^3.1.0 react@^18.2.0 react-dom@^18.2.0 react-icons@^4.10.1 react-modal@^3.16.1 react-router-dom@^6.14.2 react-scripts@5.0.1 react-tsparticles@^2.11.0 styled-components@^5.3.11 tsparticles@^2.11.0 web-vitals@^2.1.4

then

npm start

This should run our front end application.

Now for backend server, we need to install dependencies for python. I have requirements.txt file in there.
We need to do "pip install -r requirements.txt" command in terminal that will download all the dependencies at once.

now to run the back end server, just enter the below command :

uvicorn main:app --reload


demo video: https://youtu.be/iLvGmLgWZyA