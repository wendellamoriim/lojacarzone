import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.css';

// ─── Ícones inline ──────────────────────────────────────────────────────────
const Icon = {
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  add: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  eye: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  upload: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  save: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
};

const CATEGORIES = ['Iluminação', 'Som Automotivo', 'Acessórios Internos', 'Acessórios Externos', 'Performance', 'Tecnologia'];
const CAR_BRANDS  = ['Honda', 'Toyota', 'Volkswagen', 'Chevrolet', 'Ford', 'Hyundai', 'BMW', 'Mercedes-Benz', 'Fiat', 'Renault', 'Nissan', 'Mitsubishi', 'Jeep', 'Peugeot', 'Citroën'];

const emptyForm = {
  name: '', short_description: '', full_description: '',
  regular_price: '', promotional_price: '', category: '',
  brand_name: '', active: true, is_global_fit: true,
  car_brands: [],
  quantity: '0',
};

// ─── Componente Principal ────────────────────────────────────────────────────
export function AdminDashboard() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm]                 = useState(emptyForm);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null);
  const [deleting, setDeleting]         = useState(null);
  const fileRef = useRef();

  // ── Carregar produtos (com imagem e promoção já joinados) ─────────────────
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, short_description, full_description,
        regular_price, active, is_global_fit, category_id, brand_id, created_at,
        categories ( name ),
        brands ( name ),
        product_images ( image_url, is_primary ),
        product_promotions ( promotional_price, active_override ),
        product_inventory ( quantity ),
        product_compatibility ( car_brand )
      `)
      .order('created_at', { ascending: false });

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  // ── Escuta mudanças em tempo real ─────────────────────────────────────────
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('catalog-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    const promo = p.product_promotions;
    const img   = p.product_images?.find(i => i.is_primary) || p.product_images?.[0];
    const compat = (p.product_compatibility || []).map(c => c.car_brand);
    const inv   = p.product_inventory;
    setEditingProduct(p);
    setForm({
      name: p.name || '',
      short_description: p.short_description || '',
      full_description: p.full_description || '',
      regular_price: p.regular_price || '',
      promotional_price: promo?.promotional_price || '',
      category: p.categories?.name || '',
      brand_name: p.brands?.name || '',
      active: p.active ?? true,
      is_global_fit: p.is_global_fit ?? true,
      car_brands: compat,
      quantity: inv?.quantity ?? 0,
    });
    setImagePreview(img?.image_url || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleCarBrand = (brand) => {
    setForm(prev => ({
      ...prev,
      car_brands: prev.car_brands.includes(brand)
        ? prev.car_brands.filter(b => b !== brand)
        : [...prev.car_brands, brand],
    }));
  };

  // ── Slugify ───────────────────────────────────────────────────────────────
  const slugify = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // ── Salvar (Criar ou Editar) ──────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Helpers robustos de conversão de preço
    const parsePrice = (value, fallback = 0) => {
      if (!value) return fallback;
      const cleaned = String(value).trim().replace(',', '.');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? fallback : parsed;
    };

    const regularPrice = parsePrice(form.regular_price, 0);
    const promotionalPrice = form.promotional_price ? parsePrice(form.promotional_price, null) : null;

    try {
      // 1. Busca ou cria categoria
      let categoryId = null;
      if (form.category) {
        const catSlug = slugify(form.category);
        let { data: cat } = await supabase
          .from('categories')
          .select('id')
          .or(`name.ilike."${form.category}",slug.eq."${catSlug}"`)
          .maybeSingle();

        if (!cat) {
          const { data: newCat } = await supabase
            .from('categories')
            .insert({ name: form.category, slug: catSlug, active: true })
            .select('id')
            .single()
            .throwOnError();
          cat = newCat;
        }
        categoryId = cat?.id;
      }

      // 2. Busca ou cria marca
      let brandId = null;
      if (form.brand_name) {
        const brandSlug = slugify(form.brand_name);
        let { data: br } = await supabase
          .from('brands')
          .select('id')
          .or(`name.ilike."${form.brand_name}",slug.eq."${brandSlug}"`)
          .maybeSingle();

        if (!br) {
          const { data: newBr } = await supabase
            .from('brands')
            .insert({ name: form.brand_name, slug: brandSlug })
            .select('id')
            .single()
            .throwOnError();
          br = newBr;
        }
        brandId = br?.id;
      }

      // 3. Dados do produto
      const productData = {
        name: form.name,
        slug: slugify(form.name) + '-' + Date.now(),
        short_description: form.short_description,
        full_description: form.full_description,
        regular_price: regularPrice,
        active: form.active,
        is_global_fit: form.is_global_fit,
        category_id: categoryId,
        brand_id: brandId,
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', productId)
          .throwOnError();
      } else {
        const { data: newProd } = await supabase
          .from('products')
          .insert(productData)
          .select('id')
          .single()
          .throwOnError();
        productId = newProd?.id;
      }

      // 4. Upload de imagem (se houver)
      if (imageFile && productId) {
        const ext  = imageFile.name.split('.').pop();
        const path = `products/${productId}-${Date.now()}.${ext}`;
        const { data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(path, imageFile, { upsert: true });

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(path);

          // Remove imagens antigas se editando
          if (editingProduct) {
            await supabase
              .from('product_images')
              .delete()
              .eq('product_id', productId)
              .throwOnError();
          }

          await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              image_url: publicUrl,
              is_primary: true,
              display_order: 0,
            })
            .throwOnError();
        }
      }

      // 5. Promoção
      if (promotionalPrice !== null) {
        await supabase
          .from('product_promotions')
          .upsert({
            product_id: productId,
            type: 'comum',
            promotional_price: promotionalPrice,
            active_override: true,
          }, { onConflict: 'product_id' })
          .throwOnError();
      } else if (editingProduct) {
        await supabase
          .from('product_promotions')
          .update({ active_override: false })
          .eq('product_id', productId)
          .throwOnError();
      }

      // 6. Estoque (salva a quantidade definida no formulário via upsert)
      const stockQuantity = parseInt(form.quantity || '0', 10);
      await supabase
        .from('product_inventory')
        .upsert({
          product_id: productId,
          quantity: isNaN(stockQuantity) ? 0 : stockQuantity,
          low_stock_threshold: 5,
        }, { onConflict: 'product_id' })
        .throwOnError();

      // 7. Compatibilidade
      if (productId) {
        await supabase
          .from('product_compatibility')
          .delete()
          .eq('product_id', productId)
          .throwOnError();

        if (!form.is_global_fit && form.car_brands.length > 0) {
          await supabase
            .from('product_compatibility')
            .insert(
              form.car_brands.map(b => ({ product_id: productId, car_brand: b }))
            )
            .throwOnError();
        }
      }

      showToast(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto adicionado ao catálogo!');
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast('Erro ao salvar. Verifique o console ou tente novamente.', 'error');
      console.error('Erro detalhado ao salvar produto:', err);
    }

    setSaving(false);
  };

  // ── Deletar ───────────────────────────────────────────────────────────────
  const handleDelete = async (p) => {
    if (!window.confirm(`Remover "${p.name}" permanentemente?`)) return;
    setDeleting(p.id);
    await supabase.from('products').delete().eq('id', p.id);
    showToast('Produto removido.', 'error');
    setDeleting(null);
    fetchProducts();
  };

  // ── Toggle visibilidade ───────────────────────────────────────────────────
  const handleToggleActive = async (p) => {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id);
    showToast(p.active ? 'Produto ocultado do catálogo.' : 'Produto ativado no catálogo.');
    fetchProducts();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const total      = products.length;
  const ativos     = products.filter(p => p.active).length;
  const emPromocao = products.filter(p => p.product_promotions?.active_override).length;
  const baixoEstoque = products.filter(p => {
    const inv = p.product_inventory;
    return inv && inv.quantity <= 5;
  }).length;

  return (
    <div className="admin-layout">
      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <header className="admin-topbar">
        <div className="topbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="CarZone Logo" style={{ height: '24px', width: 'auto', marginRight: '12px' }} />
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '12px', display: 'flex', alignItems: 'center', height: '20px' }}>
            <span className="topbar-label" style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0, padding: 0, lineHeight: 1 }}>Painel Administrativo</span>
          </div>
        </div>
        <div className="topbar-right">
          <span className="topbar-email">{session?.user?.email}</span>
          <button className="btn-logout" onClick={() => { signOut(); navigate('/garagemcz/login'); }}>
            {Icon.logout} Sair
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* ── Stats Cards ──────────────────────────────────────────────── */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-num">{total}</div><div className="stat-lbl">Total de Produtos</div></div>
          <div className="stat-card stat-green"><div className="stat-num">{ativos}</div><div className="stat-lbl">Ativos no Catálogo</div></div>
          <div className="stat-card stat-red"><div className="stat-num">{emPromocao}</div><div className="stat-lbl">Em Promoção</div></div>
          <div className="stat-card stat-yellow"><div className="stat-num">{baixoEstoque}</div><div className="stat-lbl">Estoque Baixo</div></div>
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <div className="catalog-toolbar">
          <h2 className="toolbar-title">Catálogo de Produtos</h2>
          <button className="btn-add-product" onClick={openAddModal}>
            {Icon.add} Adicionar Produto
          </button>
        </div>

        {/* ── Tabela de Produtos ───────────────────────────────────────── */}
        {loading ? (
          <div className="admin-loading">
            <div className="spinner-large" />
            <p>Carregando catálogo...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhum produto cadastrado ainda.</p>
            <button className="btn-add-product" onClick={openAddModal}>{Icon.add} Adicionar Primeiro Produto</button>
          </div>
        ) : (
          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Promoção</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const img   = p.product_images?.find(i => i.is_primary) || p.product_images?.[0];
                  const promo = p.product_promotions?.active_override ? p.product_promotions : null;
                  return (
                    <tr key={p.id} className={!p.active ? 'row-inactive' : ''}>
                      <td>
                        <div className="product-cell">
                          <div className="product-thumb">
                            {img ? <img src={img.image_url} alt={p.name} /> : <span>{Icon.image}</span>}
                          </div>
                          <div>
                            <div className="product-name">{p.name}</div>
                            <div className="product-desc-small">{p.short_description?.slice(0, 50)}…</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-category">{p.categories?.name || '—'}</span>
                      </td>
                      <td className="price-cell">
                        R$ {parseFloat(p.regular_price).toFixed(2).replace('.', ',')}
                      </td>
                      <td>
                        {promo ? (
                          <span className="badge-promo">
                            R$ {parseFloat(promo.promotional_price).toFixed(2).replace('.', ',')}
                          </span>
                        ) : <span className="badge-no-promo">—</span>}
                      </td>
                      <td>
                        <span className={`badge-status ${p.active ? 'active' : 'inactive'}`}>
                          {p.active ? 'Ativo' : 'Oculto'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-action btn-edit" onClick={() => openEditModal(p)} title="Editar">{Icon.edit}</button>
                          <button className="btn-action btn-toggle" onClick={() => handleToggleActive(p)} title={p.active ? 'Ocultar' : 'Mostrar'}>
                            {p.active ? Icon.eyeOff : Icon.eye}
                          </button>
                          <button className="btn-action btn-del" onClick={() => handleDelete(p)} disabled={deleting === p.id} title="Remover">{Icon.trash}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Modal Adicionar / Editar ──────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>{Icon.close}</button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              {/* Upload de imagem */}
              <div className="image-upload-area" onClick={() => fileRef.current.click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-upload-placeholder">
                    {Icon.upload}
                    <span>Clique para fazer upload da imagem</span>
                    <small>JPG, PNG ou WebP</small>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div className="form-row">
                <div className="form-field full">
                  <label>Nome do Produto *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Ex: Kit LED Ultra Vision 9000LM" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Categoria</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Selecionar...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Marca do Produto</label>
                  <input value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))} placeholder="Ex: JBL, LuxLed..." />
                </div>
              </div>

              <div className="form-row row-three">
                <div className="form-field">
                  <label>Preço Normal (R$) *</label>
                  <input type="number" step="0.01" min="0" value={form.regular_price} onChange={e => setForm(f => ({ ...f, regular_price: e.target.value }))} required placeholder="0,00" />
                </div>
                <div className="form-field">
                  <label>Preço Promocional (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.promotional_price} onChange={e => setForm(f => ({ ...f, promotional_price: e.target.value }))} placeholder="0,00 (opcional)" />
                </div>
                <div className="form-field">
                  <label>Qtd. em Estoque *</label>
                  <input type="number" min="0" step="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required placeholder="0" />
                </div>
              </div>

              <div className="form-field full">
                <label>Descrição Curta</label>
                <input value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} placeholder="Resumo para aparecer no catálogo" />
              </div>

              <div className="form-field full">
                <label>Descrição Completa</label>
                <textarea rows={3} value={form.full_description} onChange={e => setForm(f => ({ ...f, full_description: e.target.value }))} placeholder="Detalhes completos do produto..." />
              </div>

              {/* Compatibilidade */}
              <div className="form-field full">
                <label>Compatibilidade com Veículos</label>
                <div className="compat-toggle">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={form.is_global_fit} onChange={e => setForm(f => ({ ...f, is_global_fit: e.target.checked }))} />
                    <span className="toggle-slider" />
                  </label>
                  <span>Serve para todos os veículos (Global)</span>
                </div>

                {!form.is_global_fit && (
                  <div className="car-brands-grid">
                    {CAR_BRANDS.map(b => (
                      <label key={b} className={`car-brand-chip ${form.car_brands.includes(b) ? 'selected' : ''}`}>
                        <input type="checkbox" checked={form.car_brands.includes(b)} onChange={() => toggleCarBrand(b)} />
                        {b}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibilidade */}
              <div className="form-field full">
                <label>Visibilidade no Site</label>
                <div className="compat-toggle">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.active ? 'Produto visível no catálogo' : 'Produto oculto do catálogo'}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <><span className="btn-spinner" /> Salvando...</> : <>{Icon.save} Salvar Produto</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
