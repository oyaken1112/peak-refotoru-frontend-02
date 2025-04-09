"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useImageContext } from "@/lib/image-context"

type Material = {
  id: number
  name: string
  color: string
  image?: string
}

export default function MaterialsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState("壁")
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null)
  const [showMaterialInfo, setShowMaterialInfo] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const materialsContainerRef = useRef<HTMLDivElement>(null)
  const { categoryImage } = useImageContext()
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
    if (categoryParam) setSelectedCategory(categoryParam)
    if (!categoryImage) router.push("/2-category")
  }, [categoryParam, categoryImage, router])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const materials: Record<string, Material[]> = {
    壁: [
      { id: 1, name: "ホワイトペイント", color: "白色" },
      { id: 2, name: "ベージュクロス", color: "ベージュ" },
      { id: 3, name: "グレーペイント", color: "グレー" },
      { id: 4, name: "ブルーペイント", color: "青色" },
      { id: 5, name: "グリーンペイント", color: "緑色" },
      { id: 6, name: "イエローペイント", color: "黄色" },
      { id: 7, name: "ピンククロス", color: "ピンク" },
      { id: 8, name: "木目調クロス", color: "茶色" },
      { id: 9, name: "モルタル調", color: "グレー" },
    ],
    床: [
      { id: 1, name: "オーク柄フローリング", color: "ベージュ", image: "/images/FL-MD-BE-016.jpg" },
      { id: 2, name: "大理石調ブラックフローリング", color: "黒色", image: "/images/FL-MD-BKM-013.jpg" },
      { id: 3, name: "グレーアッシュ柄フローリング", color: "グレー", image: "/images/FL-CR-WH-011.jpg" },
      { id: 4, name: "バーチ", color: "明るい茶色" },
      { id: 5, name: "メープル", color: "黄茶色" },
      { id: 6, name: "竹フローリング", color: "薄黄色" },
      { id: 7, name: "コルク", color: "茶色" },
      { id: 8, name: "タイル", color: "グレー" },
      { id: 9, name: "カーペット", color: "ベージュ" },
    ],
    ドア: [
      { id: 1, name: "ホワイトドア", color: "白色" },
      { id: 2, name: "ナチュラルウッド", color: "薄茶色" },
      { id: 3, name: "ダークウッド", color: "濃茶色" },
      { id: 4, name: "ガラスドア", color: "透明" },
      { id: 5, name: "フロストガラス", color: "半透明" },
      { id: 6, name: "黒塗装ドア", color: "黒色" },
      { id: 7, name: "グレードア", color: "グレー" },
      { id: 8, name: "ブルードア", color: "青色" },
      { id: 9, name: "グリーンドア", color: "緑色" },
    ],
  }

  const getMaterialsForCategory = () => materials[selectedCategory] || []
  const currentMaterials = getMaterialsForCategory().slice(currentPage * 3, currentPage * 3 + 3)
  const totalPages = Math.ceil(getMaterialsForCategory().length / 3)

  const nextPage = () => setCurrentPage(currentPage < totalPages - 1 ? currentPage + 1 : 0)
  const prevPage = () => setCurrentPage(currentPage > 0 ? currentPage - 1 : totalPages - 1)

  const handleMaterialClick = (id: number) => {
    setSelectedMaterial(id)
    setShowMaterialInfo(true)
    setTimeout(() => setShowMaterialInfo(false), 3000)
  }

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return
    const diff = e.touches[0].clientX - touchStartX
    if (Math.abs(diff) < 50) return
    diff > 0 ? prevPage() : nextPage()
    setTouchStartX(e.touches[0].clientX)
  }

  const handleNextClick = (e: React.MouseEvent) => {
    if (selectedMaterial === null) {
      e.preventDefault()
      document.getElementById("error-message")?.classList.add("show")
      setTimeout(() => document.getElementById("error-message")?.classList.remove("show"), 3000)
    }
  }

  return (
    <div className="bg-[var(--app-bg)] min-h-screen preserve-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 md:col-start-3">
            {/* ステップナビゲーションと画像省略 */}

            <div className="relative">
              <div
                ref={materialsContainerRef}
                className="material-grid mb-3"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {currentMaterials.map((material) => (
                  <div
                    key={material.id}
                    className={`material-item ${selectedMaterial === material.id ? "selected" : ""}`}
                    onClick={() => handleMaterialClick(material.id)}
                  >
                    <Image
                      src={material.image ?? `/placeholder.svg?height=144&width=144&text=${material.name}`}
                      alt={material.name}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                    <div className="material-info">
                      {material.name}
                      <br />({material.color})
                    </div>
                  </div>
                ))}
              </div>

              {/* ページネーションとボタン省略 */}

              <div className="flex justify-between mt-auto">
                <Link href="/2-category">
                  <div className="nav-button-back">
                    <span className="button-text">←戻る</span>
                  </div>
                </Link>
                <Link
                  href="/4-preview"
                  onClick={handleNextClick}
                  className={selectedMaterial === null ? "pointer-events-none" : ""}
                >
                  <div className={`nav-button ${selectedMaterial === null ? "button-disabled" : ""}`}>
                    <span className="button-text">次へ進む→</span>
                  </div>
                </Link>
              </div>

              {selectedMaterial === null && (
                <div className="error-message mt-2" id="error-message">
                  素材を選択してから次へ進んでください
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
