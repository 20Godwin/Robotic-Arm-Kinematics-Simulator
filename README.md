Robotic Arm Kinematics Simulator
A vibe coded browser-based 3D kinematics simulation environment for N-degree-of-freedom robotic manipulators. This tool provides real-time visualization and computation of forward and inverse kinematics using Denavit-Hartenberg parameters.

Technical Capabilities
Kinematics Engine
Forward Kinematics: Real-time computation of end-effector position (Cartesian coordinates) and orientation (Euler angles and quaternions) based on joint configurations.
Inverse Kinematics: Implementation of the Damped Least Squares (Levenberg-Marquardt) algorithm for numerical IK solution, with handling of kinematic singularities and joint limit constraints.
DH Parameter Support: Compatible with both Standard DH (Craig/Spong) and Modified DH (Khalil/Kleinfinger) conventions.
Transformation Matrix Analysis: Inspection of local homogeneous transformation matrices for each joint frame.

Visualization
WebGL Rendering: 3D graphics pipeline using Plotly.js with isometric scaling to maintain geometric accuracy.
Automatic Geometry Generation: Procedural mesh creation—cylindrical representations for revolute joints, prismatic joints rendered as cuboid extrusions.
Coordinate Frame Visualization: RGB axis triads for each joint reference frame; enhanced end-effector frame with labeled axes.
Expanded View Mode: Fullscreen visualization with persistent joint control interface.

Motion Planning & Analysis
Workspace Generation: Monte Carlo simulation for computing reachable workspace point clouds based on joint limits.
Trajectory Planning:
Linear interpolation in joint space (LJP)
Linear interpolation in Cartesian space (LSP) with real-time IK
Collision Detection: Geometric collision checking using capsule approximations for link geometry; detection of self-intersections and ground plane violations.

Configuration Management
Robot Presets: Pre-configured kinematic models including 6-DOF industrial arms, SCARA, articulated, Cartesian, and cylindrical coordinate robots.
Joint Control: Individual joint locking, direction inversion, and homing functionality.
Data Export/Import: JSON and CSV serialization for robot configurations.
State Sharing: Base64-encoded URL parameters for configuration and pose sharing.

Implementation
Frontend: HTML5, CSS3, vanilla JavaScript (ES6)
Graphics: Plotly.js (WebGL)
Mathematics: Math.js (matrix operations, numerical methods)

Local Deployment
No build process or dependencies required. Serve as static files:
