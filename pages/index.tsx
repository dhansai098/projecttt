import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl?: string;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();
      setNotices(data);
      setError('');
    } catch (err) {
      setError('Failed to load notices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notice');

      setNotices(notices.filter((notice) => notice.id !== id));
    } catch (err) {
      alert('Failed to delete notice');
      console.error(err);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exam':
        return 'bg-blue-100 text-blue-800';
      case 'Event':
        return 'bg-green-100 text-green-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>Notice Board</title>
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
              <Link
                href="/notice/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                + New Notice
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {notices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No notices yet</p>
              <Link
                href="/notice/new"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Create the first notice →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {notice.imageUrl && (
                    <img
                      src={notice.imageUrl}
                      alt={notice.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            getCategoryColor(notice.category)
                          }`}
                        >
                          {notice.category}
                        </span>
                        {notice.priority === 'Urgent' && (
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                            🔴 Urgent
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {notice.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {notice.body}
                    </p>

                    <p className="text-gray-500 text-xs mb-4">
                      {new Date(notice.publishDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        href={`/notice/${notice.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}