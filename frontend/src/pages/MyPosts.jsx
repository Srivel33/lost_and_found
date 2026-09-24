import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { StatusPill } from '../components/StatusPill';
import { RetentionLabel } from '../components/RetentionLabel';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../utils/format';
import { POST_STATUSES } from '../utils/constants';
import { Layers, CheckCircle, Ban, AlertTriangle, Search, PlusCircle, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const MyPosts = () => {
  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found'
  const [lostPosts, setLostPosts] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Dispute modal state
  const [disputeModalPost, setDisputeModalPost] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [lost, found] = await Promise.all([
        api.getMyLost(),
        api.getMyFound()
      ]);
      setLostPosts(lost || []);
      setFoundPosts(found || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleMarkReturned = async (postId, postType) => {
    setActionLoading(postId);
    try {
      await api.markReturned(postId, postType);
      toast.success('Item marked as Returned! Retention timer updated to 7 days.');
      fetchPosts();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleWithdraw = async (postId, postType) => {
    if (!window.confirm('Are you sure you want to withdraw this post?')) return;
    setActionLoading(postId);
    try {
      await api.withdrawPost(postId, postType);
      toast.success('Post withdrawn successfully.');
      fetchPosts();
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim() || !disputeModalPost) return;

    try {
      await api.reportUser(disputeModalPost.id, disputeReason);
      toast.success('Dispute reported to campus security & admin.');
      setDisputeModalPost(null);
      setDisputeReason('');
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    }
  };

  const currentList = activeTab === 'lost' ? lostPosts : foundPosts;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Activity & Posts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your campus lost and found submissions, mark items returned, or withdraw listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/lost"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Lost</span>
          </Link>
          <Link
            to="/found"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors border border-emerald-200"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Found</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('lost')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lost'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Lost Items</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {lostPosts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('found')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'found'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Found Items</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {foundPosts.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" count={3} />
        </div>
      ) : currentList.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={`No ${activeTab === 'lost' ? 'Lost' : 'Found'} Posts Yet`}
          description={`You have not submitted any ${activeTab} reports on the portal.`}
          action={
            <Link
              to={activeTab === 'lost' ? '/lost' : '/found'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {currentList.map((post) => {
            const isFinished = post.status === POST_STATUSES.RETURNED || post.status === POST_STATUSES.WITHDRAWN;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {post.category}
                    </span>
                    <StatusPill status={post.status} />
                    <RetentionLabel
                      createdAt={post.createdAt}
                      returnedAt={post.returnedAt}
                      status={post.status}
                    />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {post.itemName || `${post.category} item`}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Posted {formatDate(post.createdAt, 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {!isFinished && (
                    <>
                      <button
                        onClick={() => handleMarkReturned(post.id, activeTab)}
                        disabled={actionLoading === post.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors disabled:opacity-50"
                        title="Mark item as recovered and returned to owner"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Returned</span>
                      </button>

                      <button
                        onClick={() => handleWithdraw(post.id, activeTab)}
                        disabled={actionLoading === post.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
                        title="Withdraw listing"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </>
                  )}

                  {/* Report user action on found posts */}
                  {activeTab === 'found' && (
                    <button
                      onClick={() => setDisputeModalPost(post)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 text-xs font-medium rounded-xl transition-colors"
                      title="Report false claim or dispute"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report Dispute</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report User Dispute Modal */}
      {disputeModalPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Report Claim Dispute</h3>
            </div>
            <p className="text-xs text-slate-500">
              Reporting item: <strong className="text-slate-800">{disputeModalPost.itemName}</strong>
            </p>
            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Explain the dispute or suspicious claim attempt..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl border-slate-300 focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalPost(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  Submit Dispute Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
