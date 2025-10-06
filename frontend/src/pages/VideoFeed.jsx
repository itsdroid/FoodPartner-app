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
  const [isMuted, setIsMuted] = useState(false)
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
      // This would be your actual API endpoint
      const response = await axios.get('http://localhost:3000/food/videos')
      setVideos(response.data)
    } catch (error) {
      console.error('Error fetching videos:', error)
      // Fallback to mock data if API fails
      setVideos([
        {
          id: 1,
          title: "Amazing Pizza Making",
          restaurant: "Tony's Pizza",
          likes: 1234,
          comments: 89,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
          description: "Watch our chef create the perfect Margherita pizza from scratch",
          foodItem: {
            name: "Pizza Margherita",
            price: 12.99,
            ingredients: "Fresh mozzarella, tomato sauce, basil"
          }
        },
        {
          id: 2,
          title: "Sushi Master at Work",
          restaurant: "Sakura Sushi",
          likes: 2567,
          comments: 156,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=600&fit=crop",
          description: "Experience the art of sushi making with our master chef",
          foodItem: {
            name: "Salmon Sushi Platter",
            price: 18.99,
            ingredients: "Fresh salmon, rice, seaweed, wasabi"
          }
        },
        {
          id: 3,
          title: "Burger Assembly",
          restaurant: "Burger Palace",
          likes: 3456,
          comments: 234,
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=600&fit=crop",
          description: "See how we build our signature deluxe burger",
          foodItem: {
            name: "Deluxe Burger",
            price: 15.99,
            ingredients: "Beef patty, cheese, lettuce, tomato, special sauce"
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (videoId) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const handleSave = (videoId) => {
    setSavedVideos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const handleComment = async (videoId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        user: 'You',
        timestamp: new Date().toLocaleTimeString()
      }
      
      setComments(prev => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), comment]
      }))
      
      setNewComment('')
      
      // Here you would send the comment to your backend
      try {
        await axios.post(`http://localhost:3000/food/videos/${videoId}/comments`, {
          text: comment.text
        })
      } catch (error) {
        console.error('Error posting comment:', error)
      }
    }
  }

  const handleScroll = (direction) => {
    if (direction === 'up' && currentVideo > 0) {
      setCurrentVideo(currentVideo - 1)
    } else if (direction === 'down' && currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1)
    }
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
    <div className="h-screen overflow-hidden bg-black">
      <div className="relative h-full">
        {/* Video Container */}
        <div className="relative h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              {/* Video Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${videos[currentVideo].thumbnail})` }}
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      likedVideos.has(videos[currentVideo].id) 
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
                    onClick={() => setShowComments(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <MessageCircle size={20} />
                    {videos[currentVideo].comments + (comments[videos[currentVideo].id]?.length || 0)}
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all">
                    <Share size={20} />
                    Share
                  </button>
                  
                  <button
                    onClick={() => handleSave(videos[currentVideo].id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      savedVideos.has(videos[currentVideo].id) 
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

        {/* Navigation */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={`w-2 h-8 rounded-full transition-all ${
                index === currentVideo ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

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