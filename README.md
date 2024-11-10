#BIMBAM! application's Frontend

Frontend for the "BIMBAM!" application developed for the KONE challenge at Junction 2024 Back Offline.

This frontend is made with React, and contains two main pages:
- The home, which contains a map that is navigable and contains the pins of the existing projects of the user.
- The project page, which contains two parts:
  - On the left, the blueprint. It is a canvas on which the user can easily draw their blueprint so that the model can be generated any time they want.
  - On the right, the model viewer. Here, a 3D model of the project will be seen if already generated. The model can be rotated for easier analysis.
 
This application is composed of two other parts:
- [Python API which generates the 3D models](https://github.com/enricd/junction_kone_py_api)
- [Backend with connection to a MongoDB](https://github.com/bielsesa/kone-backend)
