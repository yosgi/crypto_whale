## **README.md**

# **Whale Water Simulation with Three.js**

### **Project Overview**  
This project creates a **3D scene** using **Three.js** where a whale dynamically leaps out of the ocean and re-enters the water. The scene combines **dynamic textures** and **basic physics simulation**, along with customizable water animations and environmental settings.

---

### **Key Features**

1. **Whale Jumping Out of the Water**  
   - The whale's movement is made more natural using **Flow** with path bending to simulate realistic whale leaping motion.  
   - The whale's movement design is inspired by and implemented based on [zz85/threejs-path-flow](https://github.com/zz85/threejs-path-flow).

2. **Dynamic Water and Environment**  
   - The water surface uses **normal maps** to simulate ripples and wave distortions.  
   - A **Skybox** and lighting effects are added to enhance the overall immersive experience.

---

### **Technology Stack**

- **Three.js**: For building 3D scenes, animations, and dynamic water effects.  
- **JavaScript / TypeScript**: Core logic and animation scripting.  
- **WebGL**: For rendering high-quality water and animation effects.

---

### **Run the Project**

1. **Clone the repository**:  
   ```bash
   git clone <git@github.com:yosgi/crypto_whale.git>
   cd <crypto_whale>
   ```

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Start the project**:  
   ```bash
   npm start
   ```

4. Open your browser and navigate to:  
   [http://localhost:3000](http://localhost:3000)

---

### **Future Improvements**

- Add **physics-based water splashes** using a physics engine like **Cannon.js** or **Ammo.js**.  
- Enhance whale movement by introducing dynamic path changes or procedural animations.

---

### **Credits**

- Whale's movement design inspired by [zz85/threejs-path-flow](https://github.com/zz85/threejs-path-flow).  
- **Three.js**: [https://threejs.org](https://threejs.org)  
- Water and environment textures are sourced from public libraries.

---

### **License**

This project is licensed under the **MIT License**.

---

### **Final Notes**

This project demonstrates how to use Three.js for creating an engaging 3D ocean scene with realistic animations and water effects. Contributions and suggestions are welcome! 🌊🐋

