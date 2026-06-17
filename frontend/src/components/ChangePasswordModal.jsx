/**
 * ChangePasswordModal.jsx — Modal ganti password
 * REFACTOR (F-T03): Diekstrak dari Sidebar.jsx untuk modularisasi.
 * Mengelola state form dan API call sendiri.
 */
import { useState } from 'react';
import { apiFetch, formatError } from '../utils/api';

export default function ChangePasswordModal({ show, onClose }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setMessage("");
        setMessageType("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        setMessage("");

        if (!oldPassword.trim()) {
            setMessage("Password lama wajib diisi.");
            setMessageType("error");
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setMessage("Password baru minimal 6 karakter.");
            setMessageType("error");
            return;
        }
        if (newPassword.length > 64) {
            setMessage("Password baru maksimal 64 karakter.");
            setMessageType("error");
            return;
        }
        if (oldPassword === newPassword) {
            setMessage("Password baru tidak boleh sama dengan yang lama.");
            setMessageType("error");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await apiFetch("/auth/change-password", {
                method: "PUT",
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
            });
            setMessage(data.message || "Password berhasil diubah!");
            setMessageType("success");
            setOldPassword("");
            setNewPassword("");

            // Auto close modal setelah 2 detik jika sukses
            setTimeout(() => handleClose(), 2000);
        } catch (err) {
            setMessage(formatError(err));
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px' }}>
                    <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="modal-title fw-bold"><i className="fas fa-key me-2 text-primary"></i>Ganti Password</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body py-4">
                        {message && (
                            <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} py-2`} style={{ borderRadius: '8px', fontSize: '14px' }}>
                                {message}
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">Password Lama</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Masukkan password saat ini"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">Password Baru</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Minimal 6 karakter, maksimal 64"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer border-top-0 pt-0 pb-4">
                        <button 
                            type="button" 
                            className="btn btn-light px-4 py-2" 
                            onClick={handleClose}
                            style={{ borderRadius: '8px', fontWeight: '500' }}
                        >
                            Batal
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary px-4 py-2" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{ borderRadius: '8px', fontWeight: '500' }}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Password"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
