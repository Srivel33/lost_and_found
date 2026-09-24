import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { StatusPill } from '../components/StatusPill';
import { RetentionLabel } from '../components/RetentionLabel';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { formatDate } from '../utils/format';
import { POST_STATUSES } from '../utils/constants';
import { Layers, CheckCircle2, Ban, AlertTriangle, PlusCircle, Clock, MapPin, Search } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Activity Dashboard"
        badgeIcon={Layers}
        title="My Activity & Reports"
        subtitle="Manage your campus lost and found submissions, update resolution status, or withdraw listings."
      >
        <Link
          to="/lost"
          className="btn-danger text-xs h-10 px-4"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Lost</span>
        </Link>
        <Link
          to="/found"
          className="btn-primary text-xs h-10 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Found</span>
        </Link>
      </PageHeader>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('lost')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lost'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>My Lost Items</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
            {lostPosts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('found')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'found'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>My Found Items</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
            {foundPosts.length}
          </span>
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" count={3} />
        </div>
      ) : currentList.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={`No ${activeTab === 'lost' ? 'Lost' : 'Found'} Reports Yet`}
          description={`You currently have no active ${activeTab} items recorded on your profile.`}
          action={
            <Link
              to={activeTab === 'lost' ? '/lost' : '/found'}
              className="btn-primary text-xs h-10 px-5 inline-flex"
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
                className="card-surface p-5 hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
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
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Posted {formatDate(post.createdAt, 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-wrap">
                  {!isFinished && (
                    <>
                      <button
                        onClick={() => handleMarkReturned(post.id, activeTab)}
                        disabled={actionLoading === post.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors disabled:opacity-50"
                        title="Mark item as recovered and returned"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Returned</span>
                      </button>

                      <button
                        onClick={() => handleWithdraw(post.id, activeTab)}
                        disabled={actionLoading === post.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
                        title="Withdraw listing"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </>
                  )}

                  {activeTab === 'found' && (
                    <button
                      onClick={() => setDisputeModalPost(post)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 text-xs font-medium rounded-xl transition-colors"
                      title="Report false claim attempt"
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

      {/* Dispute Modal */}
      {disputeModalPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-elevation border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Report Claim Dispute</h3>
            </div>
            <p className="text-xs text-slate-500">
              Reporting listing: <strong className="text-slate-800">{disputeModalPost.itemName}</strong>
            </p>
            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Explain the suspicious behavior or false claimant details..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full p-3 text-xs border rounded-xl border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalPost(null)}
                  className="btn-secondary text-xs h-9 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-danger text-xs h-9 px-4"
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
