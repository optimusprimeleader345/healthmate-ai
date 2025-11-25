import React, { useState } from "react";

export default function AddEmergencyModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  function save() {
    try {
      const existing = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
      const updated = [...existing, { name, phone, relation }];
      localStorage.setItem("emergencyContacts", JSON.stringify(updated));
      onSave && onSave(updated);
      onClose();
    } catch (e) {
      console.error("Save contact error", e);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add Emergency Contact</h3>
        <input className="w-full p-2 border rounded mb-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" placeholder="Relation" value={relation} onChange={(e) => setRelation(e.target.value)} />
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
