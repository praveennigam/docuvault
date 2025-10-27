// import { useState, useEffect } from "react";
// import "./RegisterPage.css";

// export default function RegisterPage({ onBack }) {
//   const [roles, setRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [requiredFields, setRequiredFields] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // ✅ Fetch all roles from backend
//   useEffect(() => {
//     fetch("/api/reference-documents")
//       .then((res) => res.json())
//       .then((data) => setRoles(data))
//       .catch((err) => console.error("Error fetching roles:", err));
//   }, []);

//   // ✅ When user selects a role, get its required fields
//   useEffect(() => {
//     const role = roles.find((r) => r._id === selectedRole);
//     if (role) {
//       const fields = role.documents?.flatMap((doc) => doc.requiredFields || []);
//       setRequiredFields(fields);
//     } else {
//       setRequiredFields([]);
//     }
//   }, [selectedRole, roles]);

//   // ✅ Handle input change
//   const handleChange = (key, value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   // ✅ Handle submit
//   const handleRegister = async (e) => {
//     e.preventDefault();

//     const payload = {
//       roleId: selectedRole,
//       email,
//       password,
//       data: formData, // all dynamic field values
//     };

//     try {
//       const res = await fetch("/api/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         alert("✅ User Registered Successfully!");
//         setEmail("");
//         setPassword("");
//         setSelectedRole("");
//         setFormData({});
//       } else {
//         alert(`❌ ${result.message || "Registration failed"}`);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("❌ Error connecting to server");
//     }
//   };

//   return (
//     <div className="auth-box">
//       <div className="card">
//         <h2>Register User</h2>
//         <form onSubmit={handleRegister}>
//           {/* Select Role */}
//           <select
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//             required
//           >
//             <option value="">-- Select Role --</option>
//             {roles.map((role) => (
//               <option key={role._id} value={role._id}>
//                 {role.label}
//               </option>
//             ))}
//           </select>

//           {/* Dynamic Fields */}
//           {requiredFields.map((field) => (
//             <input
//               key={field._id}
//               type="text"
//               placeholder={field.label}
//               value={formData[field.key] || ""}
//               onChange={(e) => handleChange(field.key, e.target.value)}
//               required
//             />
//           ))}

//           {/* Email & Password */}
//           <input
//             type="email"
//             placeholder="User Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="User Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit" className="btn register-btn">
//             Register User
//           </button>
//         </form>

//         <button className="btn back-btn" onClick={onBack}>
//           ⬅ Back
//         </button>
//       </div>
//     </div>
//   );
// }






import { useState, useEffect } from "react";
import "./RegisterPage.css";

export default function RegisterPage({ onBack, onNext }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Fetch roles from backend
  useEffect(() => {
    fetch("/api/reference-documents")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  // ✅ Handle register form submit
  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      roleId: selectedRole,
      email,
      password,
    };

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ User Registered Successfully!");
        if (onNext) onNext(selectedRole); // go to next page with that role
      } else {
        alert(`❌ ${result.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server error while registering user");
    }
  };

  return (
    <div className="auth-box">
      <div className="card">
        <h2>Register User</h2>
        <form onSubmit={handleRegister}>
          {/* Select Role */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.label}
              </option>
            ))}
          </select>

          {/* Email & Password */}
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="User Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn register-btn">
            Register
          </button>
        </form>

        <button className="btn back-btn" onClick={onBack}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
}
