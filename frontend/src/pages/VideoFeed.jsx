import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share, Bookmark, Play, Pause, Volume2, VolumeX, X, Send } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'
import axios from 'axios'

function VideoFeed() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [likedVideos, setLikedVideos] = useState(new Set())
  const [savedVideos, setSavedVideos] = useState(new Set())
  const [comments, setComments] = useState({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)

  // Fetch food partner videos from backend
  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      // Fetch reels from the new API endpoint
      const response = await axios.get('http://localhost:3000/food/reels')
      const data = response.data
      // Support both shapes: { reels: [...] } and [...]
      const reels = Array.isArray(data) ? data : (data.reels || data.videos || [])
      setVideos(reels)
    } catch (error) {
      console.error('Error fetching reels:', error)
      // If no reels exist, show empty state
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (videoId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/auth'
        return
      }

      const response = await axios.post(`http://localhost:3000/user/like/${videoId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update local state
      setLikedVideos(prev => {
        const newSet = new Set(prev)
        if (response.data.isLiked) {
          newSet.add(videoId)
        } else {
          newSet.delete(videoId)
        }
        return newSet
      })

      // Update video likes count
      setVideos(prev => prev.map(video =>
        video.id === videoId
          ? { ...video, likes: response.data.totalLikes }
          : video
      ))
    } catch (error) {
      console.error('Error liking video:', error)
    }
  }

  const handleSave = async (videoId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/auth'
        return
      }

      const response = await axios.post(`http://localhost:3000/user/save/${videoId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update local state
      setSavedVideos(prev => {
        const newSet = new Set(prev)
        if (response.data.isSaved) {
          newSet.add(videoId)
        } else {
          newSet.delete(videoId)
        }
        return newSet
      })
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const handleComment = async (videoId) => {
    if (newComment.trim()) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          // Redirect to login if not authenticated
          window.location.href = '/auth'
          return
        }

        const response = await axios.post(`http://localhost:3000/user/comment/${videoId}`, {
          text: newComment
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        // Update local comments
        setComments(prev => ({
          ...prev,
          [videoId]: [...(prev[videoId] || []), response.data.comment]
        }))

        // Update video comments count
        setVideos(prev => prev.map(video =>
          video.id === videoId
            ? { ...video, comments: response.data.totalComments }
            : video
        ))

        setNewComment('')
      } catch (error) {
        console.error('Error posting comment:', error)
      }
    }
  }

  const fetchComments = async (videoId) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/comments/${videoId}`)
      setComments(prev => ({
        ...prev,
        [videoId]: response.data.comments || []
      }))
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleShowComments = (videoId) => {
    setShowComments(!showComments)
    if (!showComments && !comments[videoId]) {
      fetchComments(videoId)
    }
  }

  const handleShare = async (videoId) => {
    try {
      // Increment share count on backend
      await axios.post(`http://localhost:3000/user/share/${videoId}`)

      // Update local share count
      setVideos(prev => prev.map(video =>
        video.id === videoId
          ? { ...video, shares: (video.shares || 0) + 1 }
          : video
      ))

      // Copy link to clipboard
      const videoUrl = `${window.location.origin}/videos/${videoId}`
      await navigator.clipboard.writeText(videoUrl)

      // You could show a toast notification here
      console.log('Link copied to clipboard!')
    } catch (error) {
      console.error('Error sharing video:', error)
    }
  }

  const handleScroll = (direction) => {
    if (direction === 'up' && currentVideo > 0) {
      setCurrentVideo(currentVideo - 1)
    } else if (direction === 'down' && currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1)
    }
  }

  // Wheel scroll to navigate like reels
  const wheelTimeout = useRef(null)
  const onWheel = (e) => {
    // Debounce to prevent skipping multiple videos per gesture
    if (wheelTimeout.current) return
    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null
    }, 350)
    if (e.deltaY > 0) handleScroll('down')
    else if (e.deltaY < 0) handleScroll('up')
  }

  // Touch swipe to navigate on mobile
  const touchStartY = useRef(null)
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return
    const endY = e.changedTouches[0].clientY
    const diff = touchStartY.current - endY
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleScroll('down')
      else handleScroll('up')
    }
    touchStartY.current = null
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Ensure video updates correctly when switching items
  useEffect(() => {
    if (!videoRef.current) return
    try {
      // Reset the media element source and playback based on isPlaying
      videoRef.current.muted = isMuted
      const playIfNeeded = async () => {
        if (isPlaying) {
          try { await videoRef.current.play() } catch { }
        } else {
          videoRef.current.pause()
        }
      }
      playIfNeeded()
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo])

  // Keep mute state in sync if user toggles
  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.muted = isMuted
  }, [isMuted])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading videos...</div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No videos available</h2>
          <p className="text-white/70">Check back later for food videos!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-black" onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="relative h-full">
        {/* Video Container */}
        <div className="relative h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'linear' }}
              className="relative h-full w-full"
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                key={videos[currentVideo].id}
                src={videos[currentVideo].videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                playsInline
                loop
                onLoadedMetadata={() => {
                  try {
                    if (isPlaying && videoRef.current) {
                      videoRef.current.play().catch(() => { })
                    }
                  } catch { }
                }}
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Video Controls */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                >
                  {isPlaying ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white" />}
                </button>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{videos[currentVideo].title}</h3>
                <p className="text-white/80 mb-2">{videos[currentVideo].restaurant}</p>
                <p className="text-white/70 text-sm mb-4">{videos[currentVideo].description}</p>

                {/* Hashtags */}
                {videos[currentVideo].hashtags && videos[currentVideo].hashtags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {videos[currentVideo].hashtags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 rounded-full text-xs bg-white/20 text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Location */}
                {videos[currentVideo].location && (
                  <div className="mb-4 flex items-center gap-2 text-white/80 text-sm">
                    <span>📍</span>
                    <span>{videos[currentVideo].location}</span>
                  </div>
                )}

                {/* Food Item Info */}
                {videos[currentVideo].foodItem && (
                  <div className="mb-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{videos[currentVideo].foodItem.name}</h4>
                        <p className="text-sm text-white/70">{videos[currentVideo].foodItem.ingredients}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${videos[currentVideo].foodItem.price}</p>
                        <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-sm">
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(videos[currentVideo].id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${likedVideos.has(videos[currentVideo].id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                  >
                    <Heart
                      size={20}
                      fill={likedVideos.has(videos[currentVideo].id) ? 'currentColor' : 'none'}
                    />
                    {videos[currentVideo].likes + (likedVideos.has(videos[currentVideo].id) ? 1 : 0)}
                  </button>

                  <button
                    onClick={() => handleShowComments(videos[currentVideo].id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <MessageCircle size={20} />
                    {videos[currentVideo].comments + (comments[videos[currentVideo].id]?.length || 0)}
                  </button>

                  <button
                    onClick={() => handleShare(videos[currentVideo].id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <Share size={20} />
                    Share
                  </button>

                  <button
                    onClick={() => handleSave(videos[currentVideo].id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${savedVideos.has(videos[currentVideo].id)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                  >
                    <Bookmark
                      size={20}
                      fill={savedVideos.has(videos[currentVideo].id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>

              {/* Volume Control */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                >
                  {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation indicator removed as per request */}

        {/* Scroll Instructions */}
        <div className="absolute bottom-4 right-4 text-white/60 text-sm">
          Scroll to navigate
        </div>
      </div>

      {/* Comments Modal - Instagram Style */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md max-h-[80vh] bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Comments</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Comments List */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {comments[videos[currentVideo].id]?.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {comment.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{comment.user}</span>
                        <span className="text-white/60 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-white/80 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}

                {(!comments[videos[currentVideo].id] || comments[videos[currentVideo].id].length === 0) && (
                  <div className="text-center text-white/60 py-8">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No comments yet</p>
                    <p className="text-sm">Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    Y
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(videos[currentVideo].id)
                        }
                      }}
                    />
                    <button
                      onClick={() => handleComment(videos[currentVideo].id)}
                      disabled={!newComment.trim()}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      <Send size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VideoFeed