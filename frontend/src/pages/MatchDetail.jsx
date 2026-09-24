import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { WhyMatched } from '../components/WhyMatched';
import { HiddenQuestion } from '../components/HiddenQuestion';
import { ContactCard } from '../components/ContactCard';
import { CooldownBanner } from '../components/CooldownBanner';
import { Skeleton } from '../components/Skeleton';
import { PageHeader } from '../components/PageHeader';
import { RelayChat } from '../components/RelayChat';
import { HandoverCode } from '../components/HandoverCode';
import { formatDate } from '../utils/format';
import { ArrowLeft, MapPin, Calendar, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const MatchDetail = () => {
  const { id: matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await api.getMatch(matchId);
      setMatch(data);

      if (data.status === 'verified' || data.status === 'confirmed' || data.status === 'claimed' || data.status === 'returned') {
        try {
          const contactData = await api.getContact(matchId);
          setContact(contactData);
        } catch {
          // not verified yet
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load match details');
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [matchId]);

  const handleSubmitAnswer = async (selectedChoice) => {
    setSubmittingAnswer(true);
    try {
      const res = await api.submitAnswer(matchId, selectedChoice);
      if (res.verified) {
        toast.success(res.message);
        const contactData = await api.getContact(matchId);
        setContact(contactData);
        setMatch(prev => ({
          ...prev,
          status: 'verified',
          isLocked: false
        }));
      } else {
        toast.error(res.message || "That answer isn't right");
        setMatch(prev => ({
          ...prev,
          attemptsLeft: res.attemptsLeft,
          lockoutUntil: res.lockoutUntil,
          isLocked: !!res.lockoutUntil
        }));
      }
    } catch (err) {
      toast.error(err.message || "That answer isn't right");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleConfirmMine = async () => {
    setSubmittingAction(true);
    try {
      await api.confirmMatch(matchId);
      toast.success('Confirmed! Item marked as claimed.');
      setMatch(prev => ({ ...prev, status: 'confirmed' }));
    } catch (err) {
      toast.error(err.message || 'Failed to confirm match');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleNotMine = async () => {
    setSubmittingAction(true);
    try {
      await api.rejectMatch(matchId);
      toast.success('Match rejected.');
      setMatch(prev => ({ ...prev, status: 'rejected' }));
    } catch (err) {
      toast.error(err.message || 'Failed to reject match');
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!match) return null;

  const isVerified = match.status === 'verified' || match.status === 'confirmed' || match.status === 'claimed' || match.status === 'returned';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Back Link & Header */}
      <div>
        <Link
          to="/matches"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Matches</span>
        </Link>

        <PageHeader
          badge="Match Verification"
          badgeIcon={Sparkles}
          title={`Match for: ${match.lostItemName}`}
          subtitle="Review the found item report and pass the verification challenge to coordinate hand-off."
        >
          <ConfidenceBadge band={match.band} />
        </PageHeader>
      </div>

      {/* Lockout Banner */}
      {match.lockoutUntil && (
        <CooldownBanner lockoutUntil={match.lockoutUntil} />
      )}

      {/* Two-Column Grid: Left (Item info) & Right (Challenge / Contact) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Item Specs & Notes */}
        <div className="lg:col-span-7 card-surface space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-3 py-1 rounded-md border border-slate-200">
              Category: {match.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Found {formatDate(match.timeFound, 'dd MMM yyyy, hh:mm a')}
            </span>
          </div>

          {/* Why Matched explanation */}
          <WhyMatched reason={match.whyMatched} />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Location</span>
                <span className="font-bold text-slate-800">{match.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Custody</span>
                <span className="font-bold text-slate-800">{match.currentLocation}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Color</span>
                <span className="font-bold text-slate-800">{match.color || 'Unspecified'}</span>
              </div>
            </div>
          </div>

          {/* Public Notes */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Finder's Public Notes
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 leading-relaxed">
              {match.description}
            </p>
          </div>

          {/* Photo */}
          {match.photo && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Found Item Photo
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 max-w-sm">
                <img src={match.photo} alt="Found item" className="w-full h-48 object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Challenge or Contact Card */}
        <div className="lg:col-span-5 sticky top-24">
          {isVerified && contact ? (
            <div className="space-y-6">
              {contact.handoverCode && <HandoverCode code={contact.handoverCode} />}
              <RelayChat matchId={matchId} />
              <ContactCard
                finderName={contact.finderName}
                finderPhone={contact.finderPhone}
                finderEmail={contact.finderEmail}
                currentLocation={contact.currentLocation}
                onConfirmMine={handleConfirmMine}
                onNotMine={handleNotMine}
                submitting={submittingAction}
                status={match.status}
              />
            </div>
          ) : (
            <HiddenQuestion
              question={match.hiddenQuestion}
              options={match.questionOptions}
              attemptsLeft={match.attemptsLeft}
              isLocked={match.isLocked}
              onSubmitAnswer={handleSubmitAnswer}
              submitting={submittingAnswer}
            />
          )}
        </div>

      </div>

    </div>
  );
};
