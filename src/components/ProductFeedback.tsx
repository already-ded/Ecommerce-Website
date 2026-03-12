"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSession } from "next-auth/react";

interface Review {
  userId: string;
  displayName: string; // Tên hiển thị (Tên thật, Nickname hoặc Ẩn danh)
  userImage: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  isAnonymous: boolean; 
}

export default function ProductFeedback({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const currentUser = session?.user as any;

  // Giả sử bạn lấy thông tin profile từ local (hoặc từ context profile bạn đã viết)
  // Trong thực tế, bạn nên lấy nickname từ database/context.
  const userNickname = "datmin"; // Lấy từ profile.nickname trong trang Profile của bạn
  const userFullName = currentUser?.name || "Khách hàng";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // State mới cho tính năng ẩn danh
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [useNickname, setUseNickname] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(`reviews_${productId}`);
    if (saved) setReviews(JSON.parse(saved));
  }, [productId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Vui lòng đăng nhập!");
    if (!newComment.trim()) return alert("Vui lòng nhập nội dung!");

    // Logic xác định tên hiển thị
    let finalName = "";
    if (isAnonymous) {
      finalName = "Người dùng ẩn danh";
    } else {
      finalName = useNickname ? (userNickname || userFullName) : userFullName;
    }

    const newEntry: Review = {
      userId: currentUser.id,
      displayName: finalName,
      userImage: isAnonymous ? "https://i.pravatar.cc/150?u=anon" : (currentUser.image || ""),
      rating: newRating,
      comment: newComment,
      images: selectedImages,
      createdAt: new Date().toLocaleString("vi-VN"),
      isAnonymous: isAnonymous
    };

    const updatedReviews = [newEntry, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));

    setNewComment("");
    setSelectedImages([]);
    setIsAnonymous(false); // Reset về mặc định sau khi gửi
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Đánh giá sản phẩm</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-10 p-5 bg-gray-50 rounded-xl border border-gray-100">
          {/* Lựa chọn chế độ hiển thị tên */}
          <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-white rounded-lg border border-gray-200 text-sm">
            <span className="text-gray-600 font-medium">Hiển thị tên:</span>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={!isAnonymous && useNickname} 
                onChange={() => { setIsAnonymous(false); setUseNickname(true); }}
                className="accent-blue-600"
              />
              Nickname ({userNickname})
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={!isAnonymous && !useNickname} 
                onChange={() => { setIsAnonymous(false); setUseNickname(false); }}
                className="accent-blue-600"
              />
              Tên thật
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-red-500">
              <input 
                type="radio" 
                checked={isAnonymous} 
                onChange={() => setIsAnonymous(true)}
                className="accent-red-500"
              />
              Ẩn danh
            </label>
          </div>

          <div className="space-y-4">
             {/* Phần chọn sao */}
             <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`text-2xl ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder={isAnonymous ? "Chia sẻ ẩn danh..." : `Chia sẻ với tên ${useNickname ? userNickname : userFullName}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            />

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
              Gửi đánh giá {isAnonymous && "(Ẩn danh)"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">Vui lòng đăng nhập để gửi feedback</div>
      )}

      {/* Hiển thị danh sách */}
      <div className="space-y-6">
        {reviews.map((r, i) => (
          <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img src={r.userImage || "https://i.pravatar.cc/150"} alt="avatar" />
             </div>
             <div className="flex-1">
                <div className="flex justify-between">
                  <span className={`font-bold ${r.isAnonymous ? "text-gray-500 italic" : "text-gray-900"}`}>
                    {r.displayName}
                  </span>
                  <span className="text-[11px] text-gray-400">{r.createdAt}</span>
                </div>
                <div className="text-yellow-400 text-xs mb-1">{"★".repeat(r.rating)}</div>
                <p className="text-gray-700 text-sm">{r.comment}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}