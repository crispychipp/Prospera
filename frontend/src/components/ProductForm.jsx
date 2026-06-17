/**
 * ProductForm.jsx — Form tambah/edit produk
 * REFACTOR (F-S02): Diekstrak dari Products.jsx untuk modularisasi.
 */
import { useState, useEffect } from 'react';

export default function ProductForm({ selectedProduct, initialData, onSave, onCancel }) {
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");

    // Sinkronisasi form saat mode edit aktif
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setCost(initialData.cost ?? "");
            setPrice(initialData.price ?? "");
            setStock(initialData.stock ?? "");
            setFormMessage("");
        }
    }, [initialData, selectedProduct]);

    const resetForm = () => {
        setName(""); setCost(""); setPrice(""); setStock("");
        setFormMessage("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setFormMessage("");

        if (name.trim() === "" || cost === "" || price === "" || stock === "") {
            setFormMessage("Semua field harus diisi (angka 0 diperbolehkan).");
            return;
        }
        if (Number(cost) < 0 || Number(price) < 0 || Number(stock) < 0) {
            setFormMessage("Harga dan stok tidak boleh negatif.");
            return;
        }
        if (!Number.isInteger(Number(stock))) {
            setFormMessage("Stok harus berupa bilangan bulat.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                product_name: name,
                product_cost: Number(cost),
                product_price: Number(price),
                product_stock: Number(stock)
            });
            resetForm();
        } catch (err) {
            setFormMessage(err.message || "Gagal menyimpan produk.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <h3>{selectedProduct ? "Edit Product" : "Add Product"}</h3>

            {formMessage && (
                <div className="product-alert product-alert--error">
                    {formMessage}
                </div>
            )}

            <div className="product-form-row">
                <input className="input product-form-field" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="input product-form-field" placeholder="Cost (Modal)" type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} />
                <input className="input product-form-field" placeholder="Price (Harga Jual)" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input className="input product-form-field" placeholder="Stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />

                <button 
                    type="button" 
                    className="button product-form-btn"
                    onClick={handleSave} 
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                    {isSubmitting ? "Menyimpan..." : (selectedProduct ? "Update Product" : "Add Product")}
                </button>

                {selectedProduct && !isSubmitting && (
                    <button 
                        type="button" 
                        className="button product-form-btn" 
                        style={{ background: "#6B7280" }} 
                        onClick={() => { resetForm(); onCancel(); }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
