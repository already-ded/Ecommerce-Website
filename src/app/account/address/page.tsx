'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

interface Address {
  id: number;
  name: string;
  company?: string;
  phone: string;
  city: string;
  cityCode: number;
  district: string;
  districtCode: number;
  ward: string;
  wardCode: number;
  street: string;
  type: 'home' | 'office';
  isDefault: boolean;
}

interface LocationOption {
  code: number;
  name: string;
}

export default function AddressPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState: Address = {
    id: 0,
    name: '',
    company: '',
    phone: '',
    city: '',
    cityCode: 0,
    district: '',
    districtCode: 0,
    ward: '',
    wardCode: 0,
    street: '',
    type: 'home',
    isDefault: false,
  };
  const [formData, setFormData] = useState<Address>(initialFormState);

  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);

  const fetchUserAddresses = async () => {
    if (!user?.id) return;
    setIsDataLoading(true);
    try {
      const res = await fetch(`/api/user/address?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách địa chỉ:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUserAddresses();
  }, [user?.id]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error('Lỗi lấy tỉnh:', err));
  }, []);

  const fetchDistricts = (cityCode: number) => {
    if (!cityCode) return;
    fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts);
        setWards([]);
      });
  };

  const fetchWards = (districtCode: number) => {
    if (!districtCode) return;
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards));
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: 0 });
    setDistricts([]);
    setWards([]);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (addr: Address) => {
    setFormData(addr);
    fetchDistricts(addr.cityCode);
    fetchWards(addr.districtCode);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        const res = await fetch(`/api/user/address?id=${id}&userId=${user?.id}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
          fetchUserAddresses();
        } else {
          alert(result.error || 'Không thể xóa địa chỉ.');
        }
      } catch (err) {
        alert('Lỗi kết nối.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const code = parseInt(value);

    if (name === 'city') {
      const selectedCity = provinces.find((p) => p.code === code);
      setFormData((prev) => ({
        ...prev,
        city: selectedCity?.name || '',
        cityCode: code,
        district: '',
        districtCode: 0,
        ward: '',
        wardCode: 0,
      }));
      fetchDistricts(code);
    } else if (name === 'district') {
      const selectedDistrict = districts.find((d) => d.code === code);
      setFormData((prev) => ({
        ...prev,
        district: selectedDistrict?.name || '',
        districtCode: code,
        ward: '',
        wardCode: 0,
      }));
      fetchWards(code);
    } else if (name === 'ward') {
      const selectedWard = wards.find((w) => w.code === code);
      setFormData((prev) => ({
        ...prev,
        ward: selectedWard?.name || '',
        wardCode: code,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/user/address', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchUserAddresses();
      } else {
        const error = await res.json();
        alert(error.error || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isDataLoading)
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-[#097b9e] border-t-transparent'></div>
      </div>
    );

  return (
    <div>
      <h1 className='m-0 mb-6 border-b border-slate-200 pb-4 text-base text-[#161616] md:mb-8 md:pb-5 md:text-lg'>
        Địa chỉ của tôi
      </h1>

      <button
        className='mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-[#b8b8b8] bg-white p-3 text-sm font-medium text-blue-600 transition hover:border-blue-600 hover:bg-[#f0f5ff] md:mb-10 md:gap-2.5 md:p-4 md:text-base'
        onClick={handleAddNew}>
        <FaPlus /> <span>Thêm địa chỉ mới</span>
      </button>

      <div className='flex flex-col gap-3 md:gap-[15px]'>
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className='flex flex-col gap-3 rounded-lg border border-[#eee] bg-white p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] md:flex-row md:items-start md:justify-between md:p-5'>
            <div className='flex-1'>
              <div className='mb-2 flex flex-wrap items-center gap-2 md:mb-2.5 md:gap-3'>
                <strong className='text-sm font-semibold uppercase text-[#333] md:text-base'>{addr.name}</strong>
                {addr.isDefault && (
                  <span className='flex items-center gap-1 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-[3px] text-[10px] font-medium text-green-600 md:text-xs'>
                    <FaCheckCircle className='text-[10px]' /> Mặc định
                  </span>
                )}
              </div>
              <p className='my-1 text-xs leading-5 text-[#333] md:my-1.5 md:text-sm md:leading-6'>
                <span className='text-[#777]'>Địa chỉ: </span>
                {addr.street}, {addr.ward}, {addr.district}, {addr.city}
              </p>
              <p className='my-1 text-xs leading-5 text-[#333] md:my-1.5 md:text-sm md:leading-6'>
                <span className='text-[#777]'>Điện thoại: </span>
                {addr.phone}
              </p>
            </div>
            <div className='flex flex-row items-center justify-end gap-4 border-t border-gray-100 pt-3 md:min-w-20 md:flex-col md:items-end md:gap-2.5 md:border-t-0 md:pt-0'>
              <button
                className='cursor-pointer border-0 bg-transparent p-0 text-xs text-blue-600 hover:font-semibold hover:underline md:text-sm'
                onClick={() => handleEdit(addr)}>
                Chỉnh sửa
              </button>
              {!addr.isDefault && (
                <button
                  className='cursor-pointer border-0 bg-transparent p-0 text-xs text-red-500 hover:font-semibold hover:underline md:text-sm'
                  onClick={() => handleDelete(addr.id)}>
                  Xóa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Responsive */}
      {showModal && (
        <div
          className='fixed inset-0 z-9999 flex items-start justify-center overflow-y-auto bg-black/50 pt-10 md:items-center md:p-4 md:pt-4'
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}>
          <div className='flex max-h-[85vh] w-[92%] flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] md:max-h-[90vh] md:w-[700px] md:max-w-[95%] md:rounded-lg'>
            {/* Drag Handle - Mobile Only */}
            <div className='flex shrink-0 justify-center py-2 md:hidden'>
              <div className='h-1 w-12 rounded-full bg-gray-300'></div>
            </div>

            {/* Modal Header */}
            <div className='flex shrink-0 items-center justify-between border-b border-[#ebebeb] bg-white px-4 py-3 md:px-6 md:py-4'>
              <h2 className='text-base font-semibold md:text-lg'>{isEditing ? 'Cập nhật địa chỉ' : 'Tạo địa chỉ'}</h2>
              <button
                type='button'
                className='cursor-pointer border-0 bg-transparent px-1 text-2xl leading-none text-[#999] hover:text-[#333]'
                onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form className='flex flex-1 flex-col overflow-hidden bg-white' onSubmit={handleSubmit}>
              <div className='flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-5 md:py-5'>
                {/* Họ tên */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Họ và tên:
                  </label>
                  <input
                    type='text'
                    name='name'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] md:py-2.5 md:text-[0.9rem]'
                    placeholder='Nhập họ tên'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Công ty */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Công ty:
                  </label>
                  <input
                    type='text'
                    name='company'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] md:py-2.5 md:text-[0.9rem]'
                    placeholder='Nhập công ty (không bắt buộc)'
                    value={(formData as any).company || ''}
                    onChange={handleChange}
                  />
                </div>

                {/* Số điện thoại */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Số điện thoại:
                  </label>
                  <input
                    type='text'
                    name='phone'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] md:py-2.5 md:text-[0.9rem]'
                    placeholder='Nhập số điện thoại'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Tỉnh/Thành phố */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Tỉnh/Thành phố:
                  </label>
                  <select title='city'
                    name='city'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] md:py-2.5 md:text-[0.9rem]'
                    value={formData.cityCode}
                    onChange={handleLocationChange}
                    required>
                    <option value={0}>Chọn Tỉnh/Thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quận huyện */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Quận huyện:
                  </label>
                  <select title='district'
                    name='district'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] disabled:bg-gray-100 md:py-2.5 md:text-[0.9rem]'
                    value={formData.districtCode}
                    onChange={handleLocationChange}
                    disabled={!formData.cityCode}
                    required>
                    <option value={0}>Chọn Quận/Huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phường xã */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Phường xã:
                  </label>
                  <select title='ward'
                    name='ward'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] disabled:bg-gray-100 md:py-2.5 md:text-[0.9rem]'
                    value={formData.wardCode}
                    onChange={handleLocationChange}
                    disabled={!formData.districtCode}
                    required>
                    <option value={0}>Chọn Phường/Xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Địa chỉ cụ thể */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-start md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:pt-2 md:text-right md:text-[0.9rem] md:font-normal'>
                    Địa chỉ:
                  </label>
                  <textarea
                    name='street'
                    className='box-border w-full rounded border border-[#ccc] px-3 py-2 text-sm text-[#333] outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)] md:py-2.5 md:text-[0.9rem]'
                    placeholder='Nhập địa chỉ cụ thể (Số nhà, ngõ...)'
                    rows={3}
                    value={formData.street}
                    onChange={handleChange}
                    required></textarea>
                </div>

                {/* Loại địa chỉ */}
                <div className='mb-4 flex flex-col gap-2 md:mb-5 md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-4'>
                  <label className='text-left text-sm font-medium text-[#555] md:text-right md:text-[0.9rem] md:font-normal'>
                    Loại địa chỉ:
                  </label>
                  <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-6'>
                    <label className='flex cursor-pointer items-center gap-2 text-sm text-[#333] md:text-[0.9rem]'>
                      <input
                        type='radio'
                        name='type'
                        value='home'
                        checked={formData.type === 'home'}
                        onChange={handleChange}
                        className='h-4 w-4 cursor-pointer md:h-[18px] md:w-[18px]'
                      />
                      Nhà riêng / Chung cư
                    </label>
                    <label className='flex cursor-pointer items-center gap-2 text-sm text-[#333] md:text-[0.9rem]'>
                      <input
                        type='radio'
                        name='type'
                        value='office'
                        checked={formData.type === 'office'}
                        onChange={handleChange}
                        className='h-4 w-4 cursor-pointer md:h-[18px] md:w-[18px]'
                      />
                      Cơ quan / Công ty
                    </label>
                  </div>
                </div>

                {/* Mặc định */}
                <div className='mb-6 flex justify-start md:pl-[156px]'>
                  <label className='flex cursor-pointer items-center gap-2 text-sm text-[#333] md:text-[0.9rem]'>
                    <input
                      type='checkbox'
                      name='isDefault'
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className='h-4 w-4 cursor-pointer md:h-[18px] md:w-[18px]'
                    />
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                {/* Action Buttons */}
                <div className='flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-white p-4 md:flex-row md:justify-end md:gap-3 md:p-6'>
                  <button
                    type='button'
                    className='w-full cursor-pointer rounded border border-[#ccc] bg-white px-6 py-2.5 text-sm text-[#555] hover:bg-[#f5f5f5] md:w-auto md:text-[0.9rem]'
                    onClick={() => setShowModal(false)}>
                    Hủy bỏ
                  </button>
                  <button
                    type='submit'
                    className='w-full cursor-pointer rounded border-0 bg-[#2562e6] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0f3484] md:w-auto md:text-[0.9rem]'>
                    {isSaving ? 'Đang lưu...' : isEditing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
