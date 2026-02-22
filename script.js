// // --- GLOBAL CONFIG STATE ---
// let joints = [];
// let savedCamera = { eye: { x: 1.5, y: 1.5, z: 1.5 } }; 

// let config = {
//     lengthUnit: 'mm',
//     angleUnit: 'deg', // 'deg' or 'rad'
//     convention: 'standard' // 'standard' or 'modified'
// };

// // --- PRESETS ---
// const robotPresets = {
//     sixDof: [ 
//         { type: 'R', theta: 0, d: 10, a: 0, alpha: 90, q: 0, min: -180, max: 180 },    
//         { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: 45, min: -90, max: 135 },    
//         { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: -45, min: -135, max: 135 },   
//         { type: 'R', theta: 0, d: 0, a: 0, alpha: -90, q: 0, min: -180, max: 180 },    
//         { type: 'R', theta: 0, d: 0, a: 0, alpha: 90, q: 0, min: -90, max: 90 },     
//         { type: 'R', theta: 0, d: 2, a: 0, alpha: 0, q: 0, min: -360, max: 360 }       
//     ],
//     articulated: [ 
//         { type: 'R', theta: 0, d: 5, a: 0, alpha: 90, q: 0, min: -180, max: 180 },
//         { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: 45, min: -90, max: 90 },
//         { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: -45, min: -135, max: 135 }
//     ],
//     scara: [ 
//         { type: 'R', theta: 0, d: 10, a: 10, alpha: 0, q: 0, min: -135, max: 135 },
//         { type: 'R', theta: 0, d: 0, a: 10, alpha: 180, q: 45, min: -135, max: 135 },
//         { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, q: 5, min: 0, max: 10 }
//     ],
//     cylindrical: [ 
//         { type: 'R', theta: 0, d: 5, a: 0, alpha: -90, q: 45, min: -180, max: 180 },
//         { type: 'P', theta: -90, d: 0, a: 0, alpha: -90, q: 5, min: 0, max: 15 },
//         { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, q: 10, min: 0, max: 15 }
//     ],
//     cartesian: [ 
//         { type: 'P', theta: 0, d: 0, a: 0, alpha: -90, q: 5, min: -10, max: 10 },
//         { type: 'P', theta: -90, d: 0, a: 0, alpha: -90, q: 5, min: -10, max: 10 },
//         { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, q: 5, min: -10, max: 10 }
//     ]
// };

// // --- GLOBAL SETTINGS LOGIC ---
// function changeLengthUnit(unit) {
//     config.lengthUnit = unit;
//     document.querySelectorAll('.unit-text').forEach(el => el.innerText = unit);
//     renderSliders();
// }

// function changeAngleUnit(unit) {
//     if (config.angleUnit === unit) return;
//     let factor = unit === 'rad' ? Math.PI / 180 : 180 / Math.PI;
    
//     joints.forEach(j => {
//         j.theta *= factor; j.alpha *= factor;
//         if (j.type === 'R') { j.q *= factor; j.min *= factor; j.max *= factor; }
//     });

//     config.angleUnit = unit;
//     let symbol = unit === 'deg' ? '°' : 'rad';
//     document.getElementById('hdr-ang1').innerText = symbol;
//     document.getElementById('hdr-ang2').innerText = symbol;
    
//     renderTable(); renderSliders();
// }

// function changeDHConvention(convention) {
//     config.convention = convention;
//     calculateFK(); 
// }

// function loadPreset(presetName) {
//     let factor = config.angleUnit === 'rad' ? Math.PI / 180 : 1;
//     let template = JSON.parse(JSON.stringify(robotPresets[presetName]));
    
//     template.forEach(j => {
//         j.theta *= factor; j.alpha *= factor;
//         if (j.type === 'R') { j.q *= factor; j.min *= factor; j.max *= factor; }
//     });

//     joints = template;
//     renderTable(); renderSliders();
// }

// // --- CHEAT SHEET MODAL LOGIC ---
// function openModal() {
//     const textContainer = document.getElementById('modal-text');
//     if (config.convention === 'standard') {
//         textContainer.innerHTML = `
//             <p style="margin-bottom:15px; color:#FFBB33;">Currently active: <strong>Standard DH (Craig / Spong)</strong></p>
//             <ul class="cheat-sheet-list">
//                 <li><span>θ<sub>i</sub></span> : Angle around <strong>Z<sub>i-1</sub></strong> from X<sub>i-1</sub> to X<sub>i</sub></li>
//                 <li><span>d<sub>i</sub></span> : Distance along <strong>Z<sub>i-1</sub></strong> from X<sub>i-1</sub> to X<sub>i</sub></li>
//                 <li><span>a<sub>i</sub></span> : Distance along <strong>X<sub>i</sub></strong> from Z<sub>i-1</sub> to Z<sub>i</sub></li>
//                 <li><span>α<sub>i</sub></span> : Angle around <strong>X<sub>i</sub></strong> from Z<sub>i-1</sub> to Z<sub>i</sub></li>
//             </ul>
//             <div class="math-block">T = Rot(Z, θ) * Trans(Z, d) * Trans(X, a) * Rot(X, α)</div>
//         `;
//     } else {
//         textContainer.innerHTML = `
//             <p style="margin-bottom:15px; color:#FFBB33;">Currently active: <strong>Modified DH (Khalil)</strong></p>
//             <ul class="cheat-sheet-list">
//                 <li><span>α<sub>i-1</sub></span> : Angle around <strong>X<sub>i-1</sub></strong> from Z<sub>i-2</sub> to Z<sub>i-1</sub></li>
//                 <li><span>a<sub>i-1</sub></span> : Distance along <strong>X<sub>i-1</sub></strong> from Z<sub>i-2</sub> to Z<sub>i-1</sub></li>
//                 <li><span>θ<sub>i</sub></span> : Angle around <strong>Z<sub>i</sub></strong> from X<sub>i-1</sub> to X<sub>i</sub></li>
//                 <li><span>d<sub>i</sub></span> : Distance along <strong>Z<sub>i</sub></strong> from X<sub>i-1</sub> to X<sub>i</sub></li>
//             </ul>
//             <div class="math-block">T = Rot(X, α) * Trans(X, a) * Rot(Z, θ) * Trans(Z, d)</div>
//         `;
//     }
//     document.getElementById('dh-modal').style.display = 'flex';
// }
// function closeModal() { document.getElementById('dh-modal').style.display = 'none'; }


// // --- DOM RENDER: TABLE & SLIDERS ---
// function renderTable() {
//     const tbody = document.getElementById('dh-body');
//     tbody.innerHTML = '';
    
//     let dec = config.angleUnit === 'rad' ? 4 : 1;
//     let step = config.angleUnit === 'rad' ? 0.05 : 0.1;

//     joints.forEach((j, index) => {
//         const tr = document.createElement('tr');
//         tr.innerHTML = `
//             <td>${index + 1}</td>
//             <td>
//                 <select onchange="updateJoint(${index}, 'type', this.value); renderSliders();">
//                     <option value="R" ${j.type === 'R' ? 'selected' : ''}>REV</option>
//                     <option value="P" ${j.type === 'P' ? 'selected' : ''}>PRIS</option>
//                 </select>
//             </td>
//             <td><input type="number" step="${step}" value="${j.theta.toFixed(dec)}" onchange="updateJoint(${index}, 'theta', this.value)"></td>
//             <td><input type="number" step="1" value="${j.d.toFixed(1)}" onchange="updateJoint(${index}, 'd', this.value)"></td>
//             <td><input type="number" step="1" value="${j.a.toFixed(1)}" onchange="updateJoint(${index}, 'a', this.value)"></td>
//             <td><input type="number" step="${step}" value="${j.alpha.toFixed(dec)}" onchange="updateJoint(${index}, 'alpha', this.value)"></td>
//             <td>
//                 <div class="limits-group">
//                     <input type="number" step="${step}" value="${j.min.toFixed(dec)}" onchange="updateJoint(${index}, 'min', this.value)">
//                     <span>to</span>
//                     <input type="number" step="${step}" value="${j.max.toFixed(dec)}" onchange="updateJoint(${index}, 'max', this.value)">
//                 </div>
//             </td>
//             <td class="highlight-col">
//                 <input id="q-num-${index}" style="border-color: #00FFFF; font-weight: bold;" type="number" value="${j.q.toFixed(dec)}" step="${step}" oninput="updateJoint(${index}, 'q', this.value)">
//             </td>
//             <td><button class="btn-danger" onclick="removeJoint(${index})">X</button></td>
//         `;
//         tbody.appendChild(tr);
//     });
//     calculateFK();
// }

// function renderSliders() {
//     const panel = document.getElementById('slider-panel');
//     panel.innerHTML = '';
    
//     let dec = config.angleUnit === 'rad' ? 3 : 1;
//     let step = config.angleUnit === 'rad' ? 0.05 : 0.1;

//     joints.forEach((j, index) => {
//         const row = document.createElement('div');
//         row.className = 'control-row';
//         row.innerHTML = `
//             <div class="control-label">J${index + 1} (${j.type})</div>
//             <div class="control-limits">${j.min.toFixed(dec)}</div>
//             <input id="q-slider-${index}" type="range" class="bp-slider" min="${j.min}" max="${j.max}" step="${step}" value="${j.q}" oninput="updateJoint(${index}, 'q', this.value)">
//             <div class="control-limits">${j.max.toFixed(dec)}</div>
//             <div id="q-val-${index}" class="control-val">${j.q.toFixed(dec)}${j.type === 'R' ? (config.angleUnit==='deg'?'°':'r') : config.lengthUnit}</div>
//         `;
//         panel.appendChild(row);
//     });
// }

// function updateJoint(index, field, value) {
//     joints[index][field] = field === 'type' ? value : parseFloat(value) || 0;
//     let dec = config.angleUnit === 'rad' ? 4 : 2;

//     if (field === 'min' || field === 'max') {
//         if (joints[index].q < joints[index].min) joints[index].q = joints[index].min;
//         if (joints[index].q > joints[index].max) joints[index].q = joints[index].max;
//         renderTable(); renderSliders();
//     } else if (field === 'q') {
//         joints[index].q = Math.max(joints[index].min, Math.min(joints[index].max, joints[index].q));
//         document.getElementById(`q-num-${index}`).value = joints[index].q.toFixed(dec);
//         const slider = document.getElementById(`q-slider-${index}`);
//         if(slider) slider.value = joints[index].q;
//         const valDisplay = document.getElementById(`q-val-${index}`);
//         if(valDisplay) valDisplay.innerText = joints[index].q.toFixed(dec) + (joints[index].type === 'R' ? (config.angleUnit==='deg'?'°':'r') : config.lengthUnit);
//         calculateFK();
//     } else {
//         calculateFK();
//     }
// }

// function addJoint() {
//     let factor = config.angleUnit === 'rad' ? Math.PI / 180 : 1;
//     joints.push({ type: 'R', theta: 0, d: 0, a: 5, alpha: 0, q: 0, min: -180*factor, max: 180*factor });
//     renderTable(); renderSliders();
// }

// function removeJoint(index) {
//     joints.splice(index, 1);
//     renderTable(); renderSliders();
// }

// // --- UI FULLSCREEN LOGIC ---
// function toggleFullscreen() {
//     const container = document.getElementById('viz-container');
//     const preview = document.getElementById('3d-preview');
//     const btn = document.getElementById('btn-enlarge');
    
//     if (preview.layout && preview.layout.scene && preview.layout.scene.camera) { savedCamera = preview.layout.scene.camera; }
//     Plotly.purge(preview);

//     container.classList.toggle('fullscreen-mode');
//     if (container.classList.contains('fullscreen-mode')) {
//         btn.innerHTML = "✖ SHRINK WINDOW"; document.body.style.overflow = 'hidden'; 
//     } else {
//         btn.innerHTML = "⛶ ENLARGE"; document.body.style.overflow = 'auto'; preview.style.height = '400px'; 
//     }

//     setTimeout(() => {
//         calculateFK(); 
//         if (!container.classList.contains('fullscreen-mode')) preview.style.height = ''; 
//     }, 50);
// }
// window.addEventListener('resize', () => {
//     const preview = document.getElementById('3d-preview');
//     if (preview.layout) { Plotly.Plots.resize('3d-preview'); }
// });


// // --- MATH & KINEMATICS (Multi-Convention & Orientation) ---
// function getDHMatrix(theta, d, a, alpha) {
//     const th = config.angleUnit === 'deg' ? theta * (Math.PI / 180) : theta; 
//     const al = config.angleUnit === 'deg' ? alpha * (Math.PI / 180) : alpha;

//     if (config.convention === 'standard') {
//         return [
//             [Math.cos(th), -Math.sin(th)*Math.cos(al),  Math.sin(th)*Math.sin(al), a*Math.cos(th)],
//             [Math.sin(th),  Math.cos(th)*Math.cos(al), -Math.cos(th)*Math.sin(al), a*Math.sin(th)],
//             [0,             Math.sin(al),              Math.cos(al),               d],
//             [0,             0,                         0,                          1]
//         ];
//     } else {
//         return [
//             [Math.cos(th),              -Math.sin(th),               0,               a],
//             [Math.cos(al)*Math.sin(th),  Math.cos(al)*Math.cos(th), -Math.sin(al), -d*Math.sin(al)],
//             [Math.sin(al)*Math.sin(th),  Math.sin(al)*Math.cos(th),  Math.cos(al),  d*Math.cos(al)],
//             [0,                          0,                          0,               1]
//         ];
//     }
// }

// // Extract RPY (Extrinsic XYZ) and Quaternion from Transformation Matrix
// function getOrientationFromMatrix(T) {
//     let r11 = T[0][0], r12 = T[0][1], r13 = T[0][2];
//     let r21 = T[1][0], r22 = T[1][1], r23 = T[1][2];
//     let r31 = T[2][0], r32 = T[2][1], r33 = T[2][2];

//     // Roll-Pitch-Yaw
//     let pitch = Math.asin(Math.max(-1, Math.min(1, -r31)));
//     let roll, yaw;
//     if (Math.cos(pitch) > 0.0001) {
//         roll = Math.atan2(r32, r33);
//         yaw = Math.atan2(r21, r11);
//     } else {
//         roll = 0;
//         yaw = Math.atan2(-r12, r22);
//     }

//     // Convert to degrees if UI requests it
//     if (config.angleUnit === 'deg') {
//         roll *= 180 / Math.PI;
//         pitch *= 180 / Math.PI;
//         yaw *= 180 / Math.PI;
//     }

//     // Quaternion (Robust extraction)
//     let tr = r11 + r22 + r33;
//     let qw, qx, qy, qz;
//     if (tr > 0) {
//         let S = Math.sqrt(tr + 1.0) * 2;
//         qw = 0.25 * S; qx = (r32 - r23) / S; qy = (r13 - r31) / S; qz = (r21 - r12) / S; 
//     } else if ((r11 > r22) && (r11 > r33)) { 
//         let S = Math.sqrt(1.0 + r11 - r22 - r33) * 2; 
//         qw = (r32 - r23) / S; qx = 0.25 * S; qy = (r12 + r21) / S; qz = (r13 + r31) / S; 
//     } else if (r22 > r33) { 
//         let S = Math.sqrt(1.0 + r22 - r11 - r33) * 2; 
//         qw = (r13 - r31) / S; qx = (r12 + r21) / S; qy = 0.25 * S; qz = (r23 + r32) / S; 
//     } else { 
//         let S = Math.sqrt(1.0 + r33 - r11 - r22) * 2; 
//         qw = (r21 - r12) / S; qx = (r13 + r31) / S; qy = (r23 + r32) / S; qz = 0.25 * S;
//     }

//     return { roll, pitch, yaw, qw, qx, qy, qz };
// }

// function getFK(simulatedJoints = null) {
//     let T = math.identity(4).toArray();
//     const arm = simulatedJoints || joints;
//     let frames = [T]; 
//     arm.forEach(j => {
//         let actualTheta = j.type === 'R' ? j.theta + j.q : j.theta;
//         let actualD = j.type === 'P' ? j.d + j.q : j.d;
//         T = math.multiply(T, getDHMatrix(actualTheta, actualD, j.a, j.alpha));
//         frames.push(T); 
//     });
//     return { T, frames };
// }

// function calculateFK() {
//     if (joints.length === 0) return;
//     const { T, frames } = getFK();
    
//     // Position
//     document.getElementById('fk-x').innerText = T[0][3].toFixed(2);
//     document.getElementById('fk-y').innerText = T[1][3].toFixed(2);
//     document.getElementById('fk-z').innerText = T[2][3].toFixed(2);

//     // Orientation
//     let ori = getOrientationFromMatrix(T);
//     let dec = config.angleUnit === 'rad' ? 3 : 1;
//     document.getElementById('fk-r').innerText = ori.roll.toFixed(dec);
//     document.getElementById('fk-p').innerText = ori.pitch.toFixed(dec);
//     document.getElementById('fk-w').innerText = ori.yaw.toFixed(dec);
    
//     document.getElementById('fk-qw').innerText = ori.qw.toFixed(3);
//     document.getElementById('fk-qx').innerText = ori.qx.toFixed(3);
//     document.getElementById('fk-qy').innerText = ori.qy.toFixed(3);
//     document.getElementById('fk-qz').innerText = ori.qz.toFixed(3);

//     // Matrix Output
//     let matrixStr = "";
//     T.forEach(row => { matrixStr += "[ " + row.map(val => val.toFixed(2).padStart(6, ' ')).join(' | ') + " ]\n"; });
//     document.getElementById('matrix-output').innerText = matrixStr;
    
//     document.getElementById('ik-status').innerText = "AWAITING INPUT...";
//     document.getElementById('ik-status').style.color = "var(--text-main)";
    
//     const preview = document.getElementById('3d-preview');
//     if (preview.layout && preview.layout.scene && preview.layout.scene.camera) {
//         savedCamera = preview.layout.scene.camera;
//     }

//     draw3DPreview(frames, joints);
// }


// // --- 3D MESH GENERATION ---
// function getShapeMesh(type, T, scale=1.5) {
//     let rawVerts = []; let i_idx=[], j_idx=[], k_idx=[];

//     if (type === 'R') {
//         const r = 0.8 * scale; const h = 1.5 * scale; const segments = 12;
//         rawVerts.push([0, 0, -h/2], [0, 0, h/2]); 
//         let bottomCenter = 0, topCenter = 1, offset = 2;
//         for(let s=0; s<segments; s++) {
//             let theta = (s/segments) * 2 * Math.PI;
//             rawVerts.push([r * Math.cos(theta), r * Math.sin(theta), -h/2]);
//             rawVerts.push([r * Math.cos(theta), r * Math.sin(theta), h/2]);
//         }
//         for(let s=0; s<segments; s++) {
//             let currB = offset + s*2, currT = offset + s*2 + 1;
//             let nextB = offset + ((s+1)%segments)*2, nextT = offset + ((s+1)%segments)*2 + 1;
//             i_idx.push(bottomCenter, topCenter, currB, nextB);
//             j_idx.push(currB, nextT, nextB, nextT);
//             k_idx.push(nextB, currT, currT, currT);
//         }
//     } else {
//         const s = 0.7 * scale; const h = 1.2 * scale;
//         rawVerts = [[-s, -s, -h], [s, -s, -h], [s, s, -h], [-s, s, -h], [-s, -s, h],  [s, -s, h],  [s, s, h],  [-s, s, h]];
//         let faces = [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]];
//         faces.forEach(f => { i_idx.push(f[0]); j_idx.push(f[1]); k_idx.push(f[2]); });
//     }

//     let x=[], y=[], z=[];
//     rawVerts.forEach(v => {
//         x.push(v[0]*T[0][0] + v[1]*T[0][1] + v[2]*T[0][2] + T[0][3]);
//         y.push(v[0]*T[1][0] + v[1]*T[1][1] + v[2]*T[1][2] + T[1][3]);
//         z.push(v[0]*T[2][0] + v[1]*T[2][1] + v[2]*T[2][2] + T[2][3]);
//     });
//     return {x, y, z, i: i_idx, j: j_idx, k: k_idx};
// }

// // --- 3D PLOTLY DRAWING (WITH ISOLATED END EFFECTOR) ---
// function draw3DPreview(frames, armJoints) {
//     let linkX=[], linkY=[], linkZ=[];
    
//     // Standard Joint Triads
//     let xVecX=[], xVecY=[], xVecZ=[], yVecX=[], yVecY=[], yVecZ=[], zVecX=[], zVecY=[], zVecZ=[]; 
//     // End-Effector (Thick) Triad
//     let eeXx=[], eeXy=[], eeXz=[], eeYx=[], eeYy=[], eeYz=[], eeZx=[], eeZy=[], eeZz=[];
    
//     const axisScale = 3.0; 
//     let annotations = [];

//     let revMesh = { x:[], y:[], z:[], i:[], j:[], k:[] }; let revOffset = 0;
//     let priMesh = { x:[], y:[], z:[], i:[], j:[], k:[] }; let priOffset = 0;

//     frames.forEach((T, index) => {
//         let px = T[0][3], py = T[1][3], pz = T[2][3];
//         linkX.push(px); linkY.push(py); linkZ.push(pz);

//         let isEndEffector = (index === frames.length - 1);

//         if (isEndEffector) {
//             // Draw Thick End Effector Frame
//             let eeScale = axisScale * 1.5;
//             eeXx.push(px, px + T[0][0] * eeScale, null); eeXy.push(py, py + T[1][0] * eeScale, null); eeXz.push(pz, pz + T[2][0] * eeScale, null);
//             eeYx.push(px, px + T[0][1] * eeScale, null); eeYy.push(py, py + T[1][1] * eeScale, null); eeYz.push(pz, pz + T[2][1] * eeScale, null);
//             eeZx.push(px, px + T[0][2] * eeScale, null); eeZy.push(py, py + T[1][2] * eeScale, null); eeZz.push(pz, pz + T[2][2] * eeScale, null);
            
//             // Add 3D Text Labels for End-Effector
//             annotations.push({ x: px+T[0][0]*eeScale*1.1, y: py+T[1][0]*eeScale*1.1, z: pz+T[2][0]*eeScale*1.1, text: 'X', font: {color: '#FF4444', size: 14}, showarrow: false });
//             annotations.push({ x: px+T[0][1]*eeScale*1.1, y: py+T[1][1]*eeScale*1.1, z: pz+T[2][1]*eeScale*1.1, text: 'Y', font: {color: '#44FF44', size: 14}, showarrow: false });
//             annotations.push({ x: px+T[0][2]*eeScale*1.1, y: py+T[1][2]*eeScale*1.1, z: pz+T[2][2]*eeScale*1.1, text: 'Z', font: {color: '#4488FF', size: 14}, showarrow: false });
//         } else {
//             // Standard Intermediary Joint Frames
//             xVecX.push(px, px + T[0][0] * axisScale, null); xVecY.push(py, py + T[1][0] * axisScale, null); xVecZ.push(pz, pz + T[2][0] * axisScale, null);
//             yVecX.push(px, px + T[0][1] * axisScale, null); yVecY.push(py, py + T[1][1] * axisScale, null); yVecZ.push(pz, pz + T[2][1] * axisScale, null);
//             zVecX.push(px, px + T[0][2] * axisScale, null); zVecY.push(py, py + T[1][2] * axisScale, null); zVecZ.push(pz, pz + T[2][2] * axisScale, null);
//         }

//         // Draw the 3D Meshes
//         if (index < armJoints.length) {
//             let jType = armJoints[index].type;
//             let meshData = getShapeMesh(jType, T, 1.0);
            
//             let targetMesh = jType === 'R' ? revMesh : priMesh;
//             let offset = jType === 'R' ? revOffset : priOffset;

//             targetMesh.x.push(...meshData.x); targetMesh.y.push(...meshData.y); targetMesh.z.push(...meshData.z);
//             targetMesh.i.push(...meshData.i.map(idx => idx + offset));
//             targetMesh.j.push(...meshData.j.map(idx => idx + offset));
//             targetMesh.k.push(...meshData.k.map(idx => idx + offset));

//             if (jType === 'R') revOffset += meshData.x.length; else priOffset += meshData.x.length;
//         }
//     });

//     let traces = [
//         { x: linkX, y: linkY, z: linkZ, mode: 'lines', line: { width: 4, color: '#FFFFFF' }, type: 'scatter3d', hoverinfo: 'none' },
//         // Thin Joint Lines
//         { x: xVecX, y: xVecY, z: xVecZ, mode: 'lines', line: {width: 3, color: 'rgba(255, 68, 68, 0.5)'}, type: 'scatter3d', hoverinfo: 'none' },
//         { x: yVecX, y: yVecY, z: yVecZ, mode: 'lines', line: {width: 3, color: 'rgba(68, 255, 68, 0.5)'}, type: 'scatter3d', hoverinfo: 'none' },
//         { x: zVecX, y: zVecY, z: zVecZ, mode: 'lines', line: {width: 3, color: 'rgba(68, 136, 255, 0.5)'}, type: 'scatter3d', hoverinfo: 'none' },
//         // THICK End Effector Lines
//         { x: eeXx, y: eeXy, z: eeXz, mode: 'lines', line: {width: 8, color: '#FF4444'}, type: 'scatter3d', hoverinfo: 'none' },
//         { x: eeYx, y: eeYy, z: eeYz, mode: 'lines', line: {width: 8, color: '#44FF44'}, type: 'scatter3d', hoverinfo: 'none' },
//         { x: eeZx, y: eeZy, z: eeZz, mode: 'lines', line: {width: 8, color: '#4488FF'}, type: 'scatter3d', hoverinfo: 'none' },
//         // Meshes
//         { type: 'mesh3d', x: revMesh.x, y: revMesh.y, z: revMesh.z, i: revMesh.i, j: revMesh.j, k: revMesh.k, color: '#00FFCC', opacity: 0.9, hoverinfo: 'none' },
//         { type: 'mesh3d', x: priMesh.x, y: priMesh.y, z: priMesh.z, i: priMesh.i, j: priMesh.j, k: priMesh.k, color: '#FF00FF', opacity: 0.8, hoverinfo: 'none' }
//     ];

//     const layout = {
//         paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
//         scene: {
//             aspectmode: 'data', 
//             xaxis: { title: 'X', showgrid: true, gridcolor: 'rgba(255,255,255,0.2)', zerolinecolor: '#fff' },
//             yaxis: { title: 'Y', showgrid: true, gridcolor: 'rgba(255,255,255,0.2)', zerolinecolor: '#fff' },
//             zaxis: { title: 'Z', showgrid: true, gridcolor: 'rgba(255,255,255,0.2)', zerolinecolor: '#fff' },
//             camera: savedCamera,
//             annotations: annotations // Adds the X, Y, Z text labels onto the end-effector
//         },
//         margin: { l: 0, r: 0, b: 0, t: 0 }, showlegend: false
//     };

//     Plotly.react('3d-preview', traces, layout, {displayModeBar: false});
// }

// // --- INVERSE KINEMATICS ---
// function calculateIK() {
//     if (joints.length === 0) return;
//     const target = [
//         parseFloat(document.getElementById('ik-x').value), parseFloat(document.getElementById('ik-y').value), parseFloat(document.getElementById('ik-z').value)
//     ];

//     const status = document.getElementById('ik-status');
//     status.innerText = "> COMPUTING TRAJECTORY..."; status.style.color = "#00FFFF";

//     setTimeout(() => {
//         let iterations = 0; const maxIterations = 500; const tolerance = 0.01; const learningRate = 0.1;

//         while (iterations < maxIterations) {
//             let currentPos = getFK().T;
//             let curVec = [currentPos[0][3], currentPos[1][3], currentPos[2][3]];
//             let error = [target[0] - curVec[0], target[1] - curVec[1], target[2] - curVec[2]];
//             let distance = Math.sqrt(error[0]**2 + error[1]**2 + error[2]**2);
//             if (distance < tolerance) break;

//             let J = []; 
//             let delta = config.angleUnit === 'rad' ? 0.001 : 0.01;
            
//             for (let i = 0; i < joints.length; i++) {
//                 let tempJoints = JSON.parse(JSON.stringify(joints));
//                 tempJoints[i].q += delta;
//                 let newT = getFK(tempJoints).T;
//                 J.push([(newT[0][3] - curVec[0]) / delta, (newT[1][3] - curVec[1]) / delta, (newT[2][3] - curVec[2]) / delta]); 
//             }

//             let deltaQ = math.multiply(math.transpose(J), error);
//             for (let i = 0; i < joints.length; i++) {
//                 joints[i].q += deltaQ[i] * learningRate;
//                 joints[i].q = Math.max(joints[i].min, Math.min(joints[i].max, joints[i].q)); 
//             }
//             iterations++;
//         }

//         if (iterations >= maxIterations) {
//             status.innerText = `> WARNING: IK INCOMPLETE / BLOCKED BY JOINT LIMITS.`; status.style.color = "#FFBB33";
//         } else {
//             status.innerText = `> SOLUTION FOUND IN ${iterations} ITERATIONS.`; status.style.color = "#00FF00";
//         }
        
//         renderTable(); renderSliders(); 
//     }, 50);
// }

// // Initialize
// window.onload = () => loadPreset('sixDof');

// --- GLOBAL STATE ---
let joints = [];
let savedCamera = { eye: { x: 1.5, y: 1.5, z: 1.5 } }; 
let keyframes = []; 
let workspacePoints = { x: [], y: [], z: [] }; 

let config = { lengthUnit: 'mm', angleUnit: 'deg', convention: 'standard' };
let inspectFrameIndex = -1; // -1 = End Effector
let renderTimer = null; // Used for Debouncing Plotly rendering

// --- PRESETS (Added locked & invert properties) ---
const robotPresets = {
    sixDof: [ 
        { type: 'R', theta: 0, d: 10, a: 0, alpha: 90, q: 0, min: -180, max: 180, locked: false, invert: false },    
        { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: 45, min: -90, max: 135, locked: false, invert: false },    
        { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: -45, min: -135, max: 135, locked: false, invert: false },   
        { type: 'R', theta: 0, d: 0, a: 0, alpha: -90, q: 0, min: -180, max: 180, locked: false, invert: false },    
        { type: 'R', theta: 0, d: 0, a: 0, alpha: 90, q: 0, min: -90, max: 90, locked: false, invert: false },     
        { type: 'R', theta: 0, d: 2, a: 0, alpha: 0, q: 0, min: -360, max: 360, locked: false, invert: false }       
    ],
    articulated: [ { type: 'R', theta: 0, d: 5, a: 0, alpha: 90, q: 0, min: -180, max: 180, locked: false, invert: false }, { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: 45, min: -90, max: 90, locked: false, invert: false }, { type: 'R', theta: 0, d: 0, a: 10, alpha: 0, q: -45, min: -135, max: 135, locked: false, invert: false } ],
    scara: [ { type: 'R', theta: 0, d: 10, a: 10, alpha: 0, q: 0, min: -135, max: 135, locked: false, invert: false }, { type: 'R', theta: 0, d: 0, a: 10, alpha: 180, q: 45, min: -135, max: 135, locked: false, invert: false }, { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, q: 5, min: 0, max: 10, locked: false, invert: false } ],
    cylindrical: [ { type: 'R', theta: 0, d: 5, a: 0, alpha: -90, q: 45, min: -180, max: 180, locked: false, invert: false }, { type: 'P', theta: -90, d: 0, a: 0, alpha: -90, q: 5, min: 0, max: 15, locked: false, invert: false }, { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, q: 10, min: 0, max: 15, locked: false, invert: false } ],
    cartesian: [ { type: 'P', theta: 0, d: 0, a: 0, alpha: -90, q: 5, min: -10, max: 10, locked: false, invert: false }, { type: 'P', theta: -90, d: 0, a: 0, alpha: -90, q: 5, min: -10, max: 10, locked: false, invert: false }, { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, q: 5, min: -10, max: 10, locked: false, invert: false } ]
};

// --- INITIALIZATION ---
window.onload = () => {
    if (window.location.hash) {
        try {
            let decoded = JSON.parse(atob(decodeURIComponent(window.location.hash.substring(1))));
            if(decoded.config) config = decoded.config;
            if(decoded.joints) joints = decoded.joints;
            
            document.getElementById('setting-length').value = config.lengthUnit; document.getElementById('setting-angle').value = config.angleUnit; document.getElementById('setting-dh').value = config.convention;
            document.querySelectorAll('.unit-text').forEach(el => el.innerText = config.lengthUnit);
            let symbol = config.angleUnit === 'deg' ? '°' : 'rad';
            document.getElementById('hdr-ang1').innerText = symbol; document.getElementById('hdr-ang2').innerText = symbol;
            
            renderTable(); renderSliders();
        } catch (e) { alert("Share link corrupted. Loading default."); loadPreset('sixDof'); }
    } else { loadPreset('sixDof'); }
};

// --- FILE I/O ---
function exportJSON() { let dl = document.createElement('a'); dl.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({config, joints}, null, 2))); dl.setAttribute("download", "robot_dh.json"); dl.click(); }
function exportCSV() {
    let csv = "Joint,Type,Theta,d,a,Alpha,Min,Max,CurrentQ,Locked,Invert\n";
    joints.forEach((j, i) => { csv += `${i+1},${j.type},${j.theta},${j.d},${j.a},${j.alpha},${j.min},${j.max},${j.q},${j.locked},${j.invert}\n`; });
    let dl = document.createElement('a'); dl.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv)); dl.setAttribute("download", "robot_dh.csv"); dl.click();
}
function importJSON(event) {
    let file = event.target.files[0]; if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        try { let data = JSON.parse(e.target.result); if (data.joints) joints = data.joints; else joints = data; if (data.config) config = data.config; renderTable(); renderSliders(); } catch (err) { alert("Invalid JSON!"); }
    }; reader.readAsText(file); event.target.value = '';
}
function generateShareLink() {
    let url = window.location.href.split('#')[0] + "#" + encodeURIComponent(btoa(JSON.stringify({config, joints})));
    navigator.clipboard.writeText(url).then(() => alert("Share Link Copied to Clipboard!"));
}

// --- SETTINGS LOGIC ---
function changeLengthUnit(unit) { config.lengthUnit = unit; document.querySelectorAll('.unit-text').forEach(el => el.innerText = unit); renderSliders(); }
function changeAngleUnit(unit) {
    if (config.angleUnit === unit) return;
    let factor = unit === 'rad' ? Math.PI / 180 : 180 / Math.PI;
    joints.forEach(j => { j.theta *= factor; j.alpha *= factor; if (j.type === 'R') { j.q *= factor; j.min *= factor; j.max *= factor; } });
    config.angleUnit = unit; let symbol = unit === 'deg' ? '°' : 'rad'; document.getElementById('hdr-ang1').innerText = symbol; document.getElementById('hdr-ang2').innerText = symbol;
    renderTable(); renderSliders();
}
function changeDHConvention(convention) { config.convention = convention; clearWorkspace(); calculateFK(); }
function loadPreset(presetName) {
    let factor = config.angleUnit === 'rad' ? Math.PI / 180 : 1;
    let template = JSON.parse(JSON.stringify(robotPresets[presetName]));
    template.forEach(j => { j.theta *= factor; j.alpha *= factor; if (j.type === 'R') { j.q *= factor; j.min *= factor; j.max *= factor; } });
    joints = template; clearWorkspace(); clearKeyframes(); inspectFrameIndex = -1; renderTable(); renderSliders();
    window.history.pushState('', document.title, window.location.pathname + window.location.search);
}

function openModal() {
    const txt = document.getElementById('modal-text');
    if (config.convention === 'standard') { txt.innerHTML = `<p style="color:#FFBB33;">Active: <strong>Standard DH (Craig / Spong)</strong></p><ul class="cheat-sheet-list"><li><span>θ<sub>i</sub></span> : Angle around Z<sub>i-1</sub></li><li><span>d<sub>i</sub></span> : Distance along Z<sub>i-1</sub></li><li><span>a<sub>i</sub></span> : Distance along X<sub>i</sub></li><li><span>α<sub>i</sub></span> : Angle around X<sub>i</sub></li></ul>`; } 
    else { txt.innerHTML = `<p style="color:#FFBB33;">Active: <strong>Modified DH (Khalil)</strong></p><ul class="cheat-sheet-list"><li><span>α<sub>i-1</sub></span> : Angle around X<sub>i-1</sub></li><li><span>a<sub>i-1</sub></span> : Distance along X<sub>i-1</sub></li><li><span>θ<sub>i</sub></span> : Angle around Z<sub>i</sub></li><li><span>d<sub>i</sub></span> : Distance along Z<sub>i</sub></li></ul>`; }
    document.getElementById('dh-modal').style.display = 'flex';
}
function closeModal() { document.getElementById('dh-modal').style.display = 'none'; }


// --- DOM RENDERING ---
function renderTable() {
    const tbody = document.getElementById('dh-body'); tbody.innerHTML = '';
    const frameSel = document.getElementById('frame-select'); frameSel.innerHTML = '<option value="-1">End Effector (Final Frame)</option>';
    let dec = config.angleUnit === 'rad' ? 4 : 1; let step = config.angleUnit === 'rad' ? 0.05 : 0.1;
    
    joints.forEach((j, index) => {
        // Populate Frame Dropdown
        frameSel.innerHTML += `<option value="${index}">Frame ${index + 1}</option>`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><select onchange="updateJoint(${index}, 'type', this.value);"><option value="R" ${j.type==='R'?'selected':''}>REV</option><option value="P" ${j.type==='P'?'selected':''}>PRIS</option></select></td>
            <td><input type="number" step="${step}" value="${j.theta.toFixed(dec)}" onchange="updateJoint(${index}, 'theta', this.value)"></td>
            <td><input type="number" step="1" value="${j.d.toFixed(1)}" onchange="updateJoint(${index}, 'd', this.value)"></td>
            <td><input type="number" step="1" value="${j.a.toFixed(1)}" onchange="updateJoint(${index}, 'a', this.value)"></td>
            <td><input type="number" step="${step}" value="${j.alpha.toFixed(dec)}" onchange="updateJoint(${index}, 'alpha', this.value)"></td>
            <td><div class="limits-group"><input type="number" step="${step}" value="${j.min.toFixed(dec)}" onchange="updateJoint(${index}, 'min', this.value)"><span>to</span><input type="number" step="${step}" value="${j.max.toFixed(dec)}" onchange="updateJoint(${index}, 'max', this.value)"></div></td>
            <td>
                <div class="q-opts-group">
                    <button class="btn-icon" title="Go to Home (0)" onclick="homeJoint(${index})">⌂</button>
                    <button class="btn-icon ${j.locked ? 'active-lock' : ''}" title="Lock Joint (Exclude from IK)" onclick="toggleLock(${index})">🔒</button>
                    <button class="btn-icon ${j.invert ? 'active' : ''}" title="Invert Direction (-q)" onclick="toggleInvert(${index})">⮂</button>
                </div>
            </td>
            <td class="highlight-col"><input id="q-num-${index}" style="border-color: #00FFFF; font-weight: bold;" type="number" value="${j.q.toFixed(dec)}" step="${step}" oninput="updateJoint(${index}, 'q', this.value)"></td>
            <td><button class="btn-danger" onclick="removeJoint(${index})">X</button></td>
        `;
        tbody.appendChild(tr);
    });
    frameSel.value = inspectFrameIndex; // Keep selection
    calculateFK();
}

function renderSliders() {
    const panel = document.getElementById('slider-panel'); panel.innerHTML = '';
    let dec = config.angleUnit === 'rad' ? 3 : 1; let step = config.angleUnit === 'rad' ? 0.05 : 0.1;
    joints.forEach((j, index) => {
        const row = document.createElement('div'); row.className = 'control-row';
        row.innerHTML = `<div class="control-label" style="${j.locked?'color:#ff4444;text-decoration:line-through;':''}">J${index + 1} (${j.type})</div><div class="control-limits">${j.min.toFixed(dec)}</div><input id="q-slider-${index}" type="range" class="bp-slider" min="${j.min}" max="${j.max}" step="${step}" value="${j.q}" oninput="updateJoint(${index}, 'q', this.value)" ${j.locked?'disabled':''}><div class="control-limits">${j.max.toFixed(dec)}</div><div id="q-val-${index}" class="control-val">${j.q.toFixed(dec)}${j.type==='R'?(config.angleUnit==='deg'?'°':'r'):config.lengthUnit}</div>`;
        panel.appendChild(row);
    });
}

function updateJoint(index, field, value) {
    let num = parseFloat(value); if (isNaN(num)) num = 0; // Validation
    joints[index][field] = field === 'type' ? value : num;
    let dec = config.angleUnit === 'rad' ? 4 : 2;
    if (field !== 'q' && field !== 'type') clearWorkspace();

    if (field === 'min' || field === 'max') {
        joints[index].q = Math.max(joints[index].min, Math.min(joints[index].max, joints[index].q));
        clearWorkspace(); renderTable(); renderSliders();
    } else if (field === 'q') {
        if(joints[index].locked) return; // Ignore slider if locked
        joints[index].q = Math.max(joints[index].min, Math.min(joints[index].max, joints[index].q));
        document.getElementById(`q-num-${index}`).value = joints[index].q.toFixed(dec);
        const slider = document.getElementById(`q-slider-${index}`); if(slider) slider.value = joints[index].q;
        const valDisplay = document.getElementById(`q-val-${index}`); if(valDisplay) valDisplay.innerText = joints[index].q.toFixed(dec) + (joints[index].type === 'R' ? (config.angleUnit==='deg'?'°':'r') : config.lengthUnit);
        calculateFK();
    } else { calculateFK(); }
}

function homeJoint(index) { joints[index].q = 0; updateJoint(index, 'q', 0); }
function toggleLock(index) { joints[index].locked = !joints[index].locked; renderTable(); renderSliders(); }
function toggleInvert(index) { joints[index].invert = !joints[index].invert; clearWorkspace(); renderTable(); renderSliders(); }
function addJoint() { let f = config.angleUnit==='rad'?Math.PI/180:1; joints.push({ type: 'R', theta: 0, d: 0, a: 5, alpha: 0, q: 0, min: -180*f, max: 180*f, locked:false, invert:false }); clearWorkspace(); renderTable(); renderSliders(); }
function removeJoint(index) { joints.splice(index, 1); if(inspectFrameIndex >= joints.length) inspectFrameIndex = -1; clearWorkspace(); renderTable(); renderSliders(); }
function changeInspectFrame(val) { inspectFrameIndex = parseInt(val); calculateFK(); }

// FULLSCREEN
function toggleFullscreen() {
    const container = document.getElementById('viz-container'); const preview = document.getElementById('3d-preview'); const btn = document.getElementById('btn-enlarge');
    if (preview.layout && preview.layout.scene && preview.layout.scene.camera) savedCamera = preview.layout.scene.camera;
    Plotly.purge(preview);
    container.classList.toggle('fullscreen-mode');
    if (container.classList.contains('fullscreen-mode')) { btn.innerHTML = "✖ SHRINK WINDOW"; document.body.style.overflow = 'hidden'; } 
    else { btn.innerHTML = "⛶ ENLARGE"; document.body.style.overflow = 'auto'; preview.style.height = '400px'; }
    setTimeout(() => { calculateFK(); if (!container.classList.contains('fullscreen-mode')) preview.style.height = ''; }, 50);
}
window.addEventListener('resize', () => { const preview = document.getElementById('3d-preview'); if (preview.layout) Plotly.Plots.resize('3d-preview'); });


// --- MATH & KINEMATICS ---
function getDHMatrix(theta, d, a, alpha) {
    const th = config.angleUnit === 'deg' ? theta * (Math.PI / 180) : theta; 
    const al = config.angleUnit === 'deg' ? alpha * (Math.PI / 180) : alpha;
    if (config.convention === 'standard') {
        return [[Math.cos(th), -Math.sin(th)*Math.cos(al), Math.sin(th)*Math.sin(al), a*Math.cos(th)], [Math.sin(th), Math.cos(th)*Math.cos(al), -Math.cos(th)*Math.sin(al), a*Math.sin(th)], [0, Math.sin(al), Math.cos(al), d], [0, 0, 0, 1]];
    } else {
        return [[Math.cos(th), -Math.sin(th), 0, a], [Math.cos(al)*Math.sin(th), Math.cos(al)*Math.cos(th), -Math.sin(al), -d*Math.sin(al)], [Math.sin(al)*Math.sin(th), Math.sin(al)*Math.cos(th), Math.cos(al), d*Math.cos(al)], [0, 0, 0, 1]];
    }
}

function getOrientationFromMatrix(T) {
    let pitch = Math.asin(Math.max(-1, Math.min(1, -T[2][0]))); let roll, yaw;
    if (Math.cos(pitch) > 0.0001) { roll = Math.atan2(T[2][1], T[2][2]); yaw = Math.atan2(T[1][0], T[0][0]); } else { roll = 0; yaw = Math.atan2(-T[0][1], T[1][1]); }
    if (config.angleUnit === 'deg') { roll *= 180/Math.PI; pitch *= 180/Math.PI; yaw *= 180/Math.PI; }
    let tr = T[0][0] + T[1][1] + T[2][2], qw, qx, qy, qz;
    if (tr > 0) { let S = Math.sqrt(tr + 1.0)*2; qw=0.25*S; qx=(T[2][1]-T[1][2])/S; qy=(T[0][2]-T[2][0])/S; qz=(T[1][0]-T[0][1])/S; } 
    else if ((T[0][0] > T[1][1]) && (T[0][0] > T[2][2])) { let S = Math.sqrt(1.0 + T[0][0] - T[1][1] - T[2][2])*2; qw=(T[2][1]-T[1][2])/S; qx=0.25*S; qy=(T[0][1]+T[1][0])/S; qz=(T[0][2]+T[2][0])/S; } 
    else if (T[1][1] > T[2][2]) { let S = Math.sqrt(1.0 + T[1][1] - T[0][0] - T[2][2])*2; qw=(T[0][2]-T[2][0])/S; qx=(T[0][1]+T[1][0])/S; qy=0.25*S; qz=(T[1][2]+T[2][1])/S; } 
    else { let S = Math.sqrt(1.0 + T[2][2] - T[0][0] - T[1][1])*2; qw=(T[1][0]-T[0][1])/S; qx=(T[0][2]+T[2][0])/S; qy=(T[1][2]+T[2][1])/S; qz=0.25*S; }
    return { roll, pitch, yaw, qw, qx, qy, qz };
}

function getFK(simulatedJoints = null) {
    let T = math.identity(4).toArray(); const arm = simulatedJoints || joints; let frames = [T]; let localFrames = [T];
    arm.forEach(j => { 
        let effQ = j.invert ? -j.q : j.q; // Handle Invert Math
        let actualTheta = j.type === 'R' ? j.theta + effQ : j.theta; 
        let actualD = j.type === 'P' ? j.d + effQ : j.d; 
        let A = getDHMatrix(actualTheta, actualD, j.a, j.alpha);
        localFrames.push(A);
        T = math.multiply(T, A); 
        frames.push(T); 
    });
    return { T, frames, localFrames };
}

function calculateFK(redrawUI = true) {
    if (joints.length === 0) return;
    const { T, frames, localFrames } = getFK();
    
    if (redrawUI) {
        document.getElementById('fk-x').innerText = T[0][3].toFixed(2); document.getElementById('fk-y').innerText = T[1][3].toFixed(2); document.getElementById('fk-z').innerText = T[2][3].toFixed(2);
        let ori = getOrientationFromMatrix(T); let dec = config.angleUnit === 'rad' ? 3 : 1;
        document.getElementById('fk-r').innerText = ori.roll.toFixed(dec); document.getElementById('fk-p').innerText = ori.pitch.toFixed(dec); document.getElementById('fk-w').innerText = ori.yaw.toFixed(dec);
        document.getElementById('fk-qw').innerText = ori.qw.toFixed(3); document.getElementById('fk-qx').innerText = ori.qx.toFixed(3); document.getElementById('fk-qy').innerText = ori.qy.toFixed(3); document.getElementById('fk-qz').innerText = ori.qz.toFixed(3);
        
        // Frame Inspector
        let tIdx = inspectFrameIndex === -1 ? frames.length - 1 : inspectFrameIndex + 1;
        let mLocal = "", mGlob = "";
        localFrames[tIdx].forEach(row => mLocal += "[ " + row.map(val => val.toFixed(2).padStart(6, ' ')).join(' | ') + " ]\n");
        frames[tIdx].forEach(row => mGlob += "[ " + row.map(val => val.toFixed(2).padStart(6, ' ')).join(' | ') + " ]\n");
        document.getElementById('matrix-local').innerText = mLocal; document.getElementById('matrix-global').innerText = mGlob;

        checkCollisions(frames);

        const preview = document.getElementById('3d-preview'); if (preview.layout && preview.layout.scene && preview.layout.scene.camera) savedCamera = preview.layout.scene.camera;
        
        // DEBOUNCE PLOTLY
        clearTimeout(renderTimer);
        renderTimer = setTimeout(() => draw3DPreview(frames, joints), 15);
    }
}


// --- COLLISION ENGINE ---
function dist3D_Segment_to_Segment(p1, p2, p3, p4) {
    let u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]]; let v = [p4[0]-p3[0], p4[1]-p3[1], p4[2]-p3[2]]; let w = [p1[0]-p3[0], p1[1]-p3[1], p1[2]-p3[2]];
    let a = u[0]*u[0] + u[1]*u[1] + u[2]*u[2], b = u[0]*v[0] + u[1]*v[1] + u[2]*v[2], c = v[0]*v[0] + v[1]*v[1] + v[2]*v[2], d = u[0]*w[0] + u[1]*w[1] + u[2]*w[2], e = v[0]*w[0] + v[1]*w[1] + v[2]*w[2];
    let D = a*c - b*b; let sc, sN, sD = D; let tc, tN, tD = D;
    if (D < 1e-8) { sN = 0.0; sD = 1.0; tN = e; tD = c; } else { sN = (b*e - c*d); tN = (a*e - b*d); if (sN < 0.0) { sN = 0.0; tN = e; tD = c; } else if (sN > sD) { sN = sD; tN = e + b; tD = c; } }
    if (tN < 0.0) { tN = 0.0; if (-d < 0.0) sN = 0.0; else if (-d > a) sN = sD; else { sN = -d; sD = a; } } else if (tN > tD) { tN = tD; if ((-d + b) < 0.0) sN = 0; else if ((-d + b) > a) sN = sD; else { sN = (-d + b); sD = a; } }
    sc = (Math.abs(sN) < 1e-8 ? 0.0 : sN / sD); tc = (Math.abs(tN) < 1e-8 ? 0.0 : tN / tD);
    let dP = [w[0] + (sc*u[0]) - (tc*v[0]), w[1] + (sc*u[1]) - (tc*v[1]), w[2] + (sc*u[2]) - (tc*v[2])];
    return Math.sqrt(dP[0]*dP[0] + dP[1]*dP[1] + dP[2]*dP[2]);
}

function checkCollisions(frames) {
    const alertBox = document.getElementById('collision-alert'); let coll = false; let msg = "";
    for (let i = 1; i < frames.length; i++) { if (frames[i][2][3] < -0.1) { coll = true; msg = "⚠️ CRASH: LINK " + i + " INTERSECTS FLOOR (Z<0)"; break; } }
    if (!coll && frames.length > 3) {
        const threshold = 1.6; let points = frames.map(T => [T[0][3], T[1][3], T[2][3]]);
        for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 2; j < points.length - 1; j++) {
                let dist = dist3D_Segment_to_Segment(points[i], points[i+1], points[j], points[j+1]);
                if (dist < threshold && dist > 0.01) { coll = true; msg = `⚠️ SELF COLLISION: LINK ${i+1} HITS LINK ${j+1}`; break; }
            } if (coll) break;
        }
    }
    if (coll) { alertBox.className = "collision-box bg-red"; alertBox.innerText = msg; } else { alertBox.className = "collision-box bg-green"; alertBox.innerText = "✔️ KINEMATIC CHAIN CLEAR (NO COLLISIONS)"; }
}

// --- INVERSE KINEMATICS (ADVANCED DLS) ---
function runIKMath(tx, ty, tz) {
    let maxIter = parseInt(document.getElementById('ik-iter').value) || 200; let tol = parseFloat(document.getElementById('ik-tol').value) || 0.01; let lr = parseFloat(document.getElementById('ik-lr').value) || 0.5; let damping = parseFloat(document.getElementById('ik-damp').value) || 0.1; let useDLS = document.getElementById('ik-usedls').checked;
    let errorDist = 999; let hitLimits = false; let isSingular = false; let tempJoints = JSON.parse(JSON.stringify(joints)); 
    
    for (let iter = 0; iter < maxIter; iter++) {
        let T = getFK(tempJoints).T; let curVec = [T[0][3], T[1][3], T[2][3]]; let e = [tx - curVec[0], ty - curVec[1], tz - curVec[2]];
        errorDist = Math.sqrt(e[0]**2 + e[1]**2 + e[2]**2);
        if (errorDist < tol) break;

        let J_T = []; let delta = 0.001;
        for (let i = 0; i < tempJoints.length; i++) {
            if (tempJoints[i].locked) { J_T.push([0, 0, 0]); continue; } // Ignore Locked Joints
            let jCopy = JSON.parse(JSON.stringify(tempJoints)); jCopy[i].q += delta;
            let nT = getFK(jCopy).T; J_T.push([ (nT[0][3] - curVec[0])/delta, (nT[1][3] - curVec[1])/delta, (nT[2][3] - curVec[2])/delta ]);
        }
        let J = math.transpose(J_T); let deltaQ;

        if (useDLS) {
            let JJT = math.multiply(J, J_T); let det = math.det(JJT); if (Math.abs(det) < 0.00001) isSingular = true;
            let damped_JJT = math.add(JJT, math.multiply(math.identity(3).toArray(), damping*damping));
            deltaQ = math.multiply(J_T, math.multiply(math.inv(damped_JJT), e));
        } else { deltaQ = math.multiply(J_T, e); }

        hitLimits = false;
        for (let i = 0; i < tempJoints.length; i++) {
            if (tempJoints[i].locked) continue;
            let newQ = tempJoints[i].q + (deltaQ[i] * lr);
            if (newQ <= tempJoints[i].min || newQ >= tempJoints[i].max) hitLimits = true;
            tempJoints[i].q = Math.max(tempJoints[i].min, Math.min(tempJoints[i].max, newQ));
        }
    }
    let status = "SUCCESS"; let badgeClass = "bg-green";
    if (errorDist >= tol) { if (isSingular && !useDLS) { status = "SINGULARITY"; badgeClass = "bg-red"; } else if (hitLimits) { status = "HIT LIMITS"; badgeClass = "bg-orange"; } else { status = "UNREACHABLE"; badgeClass = "bg-red"; } }
    return { errorDist, status, badgeClass, finalQ: tempJoints.map(j => j.q) };
}

function solveSingleIK() {
    let tx = parseFloat(document.getElementById('ik-x').value); let ty = parseFloat(document.getElementById('ik-y').value); let tz = parseFloat(document.getElementById('ik-z').value);
    let res = runIKMath(tx, ty, tz); res.finalQ.forEach((q, i) => { if(!joints[i].locked) joints[i].q = q; });
    document.getElementById('ik-err').innerText = res.errorDist.toFixed(3); let badge = document.getElementById('ik-stat'); badge.innerText = res.status; badge.className = "status-badge " + res.badgeClass;
    renderTable(); renderSliders();
}

// --- MONTE CARLO WORKSPACE ---
function generateWorkspace() {
    let pts = parseInt(document.getElementById('ws-pts').value) || 1500;
    workspacePoints = { x: [], y: [], z: [] }; let tempJoints = JSON.parse(JSON.stringify(joints));
    for (let i = 0; i < pts; i++) {
        tempJoints.forEach(j => { if(!j.locked) j.q = j.min + Math.random() * (j.max - j.min); });
        let T = getFK(tempJoints).T; workspacePoints.x.push(T[0][3]); workspacePoints.y.push(T[1][3]); workspacePoints.z.push(T[2][3]);
    }
    calculateFK(); 
}
function clearWorkspace() { workspacePoints = { x: [], y: [], z: [] }; calculateFK(); }

// --- KEYFRAME TRAJECTORY PLANNER ---
function addKeyframe() { keyframes.push(joints.map(j => j.q)); updateKeyframeUI(); }
function clearKeyframes() { keyframes = []; updateKeyframeUI(); }
function updateKeyframeUI() { const list = document.getElementById('keyframe-list'); list.innerHTML = ''; keyframes.forEach((kf, i) => { list.innerHTML += `<li><span>POSE ${i+1}</span><span style="color:var(--text-highlight);">[ ${kf.map(q => q.toFixed(1)).join(', ')} ]</span></li>`; }); }

async function playTrajectory() {
    if (keyframes.length < 2) { alert("Please record at least 2 keyframes."); return; }
    let mode = document.getElementById('traj-mode').value; let steps = 25; 
    joints.forEach((j, i) => j.q = keyframes[0][i]); calculateFK(); renderSliders(); await new Promise(r => setTimeout(r, 400)); 

    for (let k = 0; k < keyframes.length - 1; k++) {
        let qStart = keyframes[k]; let qEnd = keyframes[k+1];
        if (mode === 'joint') {
            for (let s = 1; s <= steps; s++) {
                let t = s / steps; joints.forEach((j, i) => j.q = qStart[i] + t * (qEnd[i] - qStart[i]));
                calculateFK(true); renderSliders(); await new Promise(r => setTimeout(r, 30));
            }
        } else {
            let T_start = getFK(joints.map((j,i)=>({...j, q:qStart[i]}))).T; let T_end = getFK(joints.map((j,i)=>({...j, q:qEnd[i]}))).T;
            let pStart = [T_start[0][3], T_start[1][3], T_start[2][3]]; let pEnd = [T_end[0][3], T_end[1][3], T_end[2][3]];
            for (let s = 1; s <= steps; s++) {
                let t = s / steps; let res = runIKMath(pStart[0] + t*(pEnd[0]-pStart[0]), pStart[1] + t*(pEnd[1]-pStart[1]), pStart[2] + t*(pEnd[2]-pStart[2]));
                res.finalQ.forEach((q, i) => { if(!joints[i].locked) joints[i].q = q; }); calculateFK(true); renderSliders(); await new Promise(r => setTimeout(r, 30));
            }
        }
        await new Promise(r => setTimeout(r, 300)); 
    }
}

// --- 3D RENDERING ---
function getShapeMesh(type, T, scale=1.5) {
    let rawVerts = []; let i=[], j=[], k=[];
    if (type === 'R') {
        const r = 0.8 * scale; const h = 1.5 * scale; const segments = 12; rawVerts.push([0, 0, -h/2], [0, 0, h/2]); let o = 2;
        for(let s=0; s<segments; s++) { let th = (s/segments)*2*Math.PI; rawVerts.push([r*Math.cos(th), r*Math.sin(th), -h/2], [r*Math.cos(th), r*Math.sin(th), h/2]); }
        for(let s=0; s<segments; s++) { let cB=o+s*2, cT=o+s*2+1, nB=o+((s+1)%segments)*2, nT=o+((s+1)%segments)*2+1; i.push(0, 1, cB, nB); j.push(cB, nT, nB, nT); k.push(nB, cT, cT, cT); }
    } else {
        const s = 0.7 * scale; const h = 1.2 * scale; rawVerts = [[-s,-s,-h], [s,-s,-h], [s,s,-h], [-s,s,-h], [-s,-s,h], [s,-s,h], [s,s,h], [-s,s,h]];
        let f = [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]]; f.forEach(face => { i.push(face[0]); j.push(face[1]); k.push(face[2]); });
    }
    let x=[], y=[], z=[]; rawVerts.forEach(v => { x.push(v[0]*T[0][0] + v[1]*T[0][1] + v[2]*T[0][2] + T[0][3]); y.push(v[0]*T[1][0] + v[1]*T[1][1] + v[2]*T[1][2] + T[1][3]); z.push(v[0]*T[2][0] + v[1]*T[2][1] + v[2]*T[2][2] + T[2][3]); }); return {x, y, z, i, j, k};
}

function draw3DPreview(frames, armJoints) {
    let linkX=[], linkY=[], linkZ=[]; let xVecX=[], xVecY=[], xVecZ=[], yVecX=[], yVecY=[], yVecZ=[], zVecX=[], zVecY=[], zVecZ=[]; let eeXx=[], eeXy=[], eeXz=[], eeYx=[], eeYy=[], eeYz=[], eeZx=[], eeZy=[], eeZz=[];
    const axisScale = 3.0; let annotations = []; let revMesh = { x:[], y:[], z:[], i:[], j:[], k:[] }; let revOffset = 0; let priMesh = { x:[], y:[], z:[], i:[], j:[], k:[] }; let priOffset = 0;

    let targetHlIdx = inspectFrameIndex === -1 ? frames.length - 1 : inspectFrameIndex + 1;

    frames.forEach((T, index) => {
        let px = T[0][3], py = T[1][3], pz = T[2][3]; linkX.push(px); linkY.push(py); linkZ.push(pz);

        if (index === targetHlIdx) {
            let eeScale = axisScale * 1.5;
            eeXx.push(px, px + T[0][0]*eeScale, null); eeXy.push(py, py + T[1][0]*eeScale, null); eeXz.push(pz, pz + T[2][0]*eeScale, null); eeYx.push(px, px + T[0][1]*eeScale, null); eeYy.push(py, py + T[1][1]*eeScale, null); eeYz.push(pz, pz + T[2][1]*eeScale, null); eeZx.push(px, px + T[0][2]*eeScale, null); eeZy.push(py, py + T[1][2]*eeScale, null); eeZz.push(pz, pz + T[2][2]*eeScale, null);
            annotations.push({ x: px+T[0][0]*eeScale*1.1, y: py+T[1][0]*eeScale*1.1, z: pz+T[2][0]*eeScale*1.1, text: 'X', font: {color: '#FF4444', size: 14}, showarrow: false }); annotations.push({ x: px+T[0][1]*eeScale*1.1, y: py+T[1][1]*eeScale*1.1, z: pz+T[2][1]*eeScale*1.1, text: 'Y', font: {color: '#44FF44', size: 14}, showarrow: false }); annotations.push({ x: px+T[0][2]*eeScale*1.1, y: py+T[1][2]*eeScale*1.1, z: pz+T[2][2]*eeScale*1.1, text: 'Z', font: {color: '#4488FF', size: 14}, showarrow: false });
        } else {
            xVecX.push(px, px+T[0][0]*axisScale, null); xVecY.push(py, py+T[1][0]*axisScale, null); xVecZ.push(pz, pz+T[2][0]*axisScale, null); yVecX.push(px, px+T[0][1]*axisScale, null); yVecY.push(py, py+T[1][1]*axisScale, null); yVecZ.push(pz, pz+T[2][1]*axisScale, null); zVecX.push(px, px+T[0][2]*axisScale, null); zVecY.push(py, py+T[1][2]*axisScale, null); zVecZ.push(pz, pz+T[2][2]*axisScale, null);
        }

        if (index < armJoints.length) {
            let jType = armJoints[index].type; let meshData = getShapeMesh(jType, T, 1.0);
            let targetMesh = jType === 'R' ? revMesh : priMesh; let offset = jType === 'R' ? revOffset : priOffset;
            targetMesh.x.push(...meshData.x); targetMesh.y.push(...meshData.y); targetMesh.z.push(...meshData.z); targetMesh.i.push(...meshData.i.map(idx => idx + offset)); targetMesh.j.push(...meshData.j.map(idx => idx + offset)); targetMesh.k.push(...meshData.k.map(idx => idx + offset));
            if (jType === 'R') revOffset += meshData.x.length; else priOffset += meshData.x.length;
        }
    });

    let traces = [
        { x: linkX, y: linkY, z: linkZ, mode: 'lines', line: { width: 4, color: '#FFFFFF' }, type: 'scatter3d', hoverinfo: 'none' },
        { x: xVecX, y: xVecY, z: xVecZ, mode: 'lines', line: {width: 3, color: 'rgba(255,68,68,0.5)'}, type: 'scatter3d', hoverinfo: 'none' }, { x: yVecX, y: yVecY, z: yVecZ, mode: 'lines', line: {width: 3, color: 'rgba(68,255,68,0.5)'}, type: 'scatter3d', hoverinfo: 'none' }, { x: zVecX, y: zVecY, z: zVecZ, mode: 'lines', line: {width: 3, color: 'rgba(68,136,255,0.5)'}, type: 'scatter3d', hoverinfo: 'none' },
        { x: eeXx, y: eeXy, z: eeXz, mode: 'lines', line: {width: 8, color: '#FF4444'}, type: 'scatter3d', hoverinfo: 'none' }, { x: eeYx, y: eeYy, z: eeYz, mode: 'lines', line: {width: 8, color: '#44FF44'}, type: 'scatter3d', hoverinfo: 'none' }, { x: eeZx, y: eeZy, z: eeZz, mode: 'lines', line: {width: 8, color: '#4488FF'}, type: 'scatter3d', hoverinfo: 'none' },
        { type: 'mesh3d', x: revMesh.x, y: revMesh.y, z: revMesh.z, i: revMesh.i, j: revMesh.j, k: revMesh.k, color: '#00FFCC', opacity: 0.9, hoverinfo: 'none' }, { type: 'mesh3d', x: priMesh.x, y: priMesh.y, z: priMesh.z, i: priMesh.i, j: priMesh.j, k: priMesh.k, color: '#FF00FF', opacity: 0.8, hoverinfo: 'none' }
    ];

    if (workspacePoints.x.length > 0) traces.push({ x: workspacePoints.x, y: workspacePoints.y, z: workspacePoints.z, mode: 'markers', marker: {size: 3, color: '#00FFFF', opacity: 0.4}, type: 'scatter3d', hoverinfo: 'none', name: 'Workspace' });

    const layout = { paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', scene: { aspectmode: 'data', xaxis: { title: 'X', showgrid: true, gridcolor: 'rgba(255,255,255,0.2)', zerolinecolor: '#fff' }, yaxis: { title: 'Y', showgrid: true, gridcolor: 'rgba(255,255,255,0.2)', zerolinecolor: '#fff' }, zaxis: { title: 'Z', showgrid: true, gridcolor: 'rgba(255,255,255,0.2)', zerolinecolor: '#fff' }, camera: savedCamera, annotations: annotations }, margin: { l: 0, r: 0, b: 0, t: 0 }, showlegend: false };
    Plotly.react('3d-preview', traces, layout, {displayModeBar: false});
}

// Initialize
window.onload = () => loadPreset('sixDof');