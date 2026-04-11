"use client";
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function MeetingView() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') || 'codingcanvas_lobby';
  const name = searchParams.get('name') || 'Guest';
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-black">
      <JitsiMeeting
        roomName={`CodingCanvas_${room}`}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        }}
        userInfo={{
          displayName: name,
          email: ''
        }}
        onApiReady={(externalApi) => {
          externalApi.addEventListeners({
            videoConferenceLeft: () => {
              router.back();
            }
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
}

export default function MeetingPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-cc-surface-base flex flex-col items-center justify-center text-cc-secondary gap-6">
        <div className="w-16 h-16 border-4 border-cc-primary border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-black">Joining CodingCanvas Classroom...</h2>
        <p className="text-gray-500 font-medium">Securing connection & loading compiler hooks...</p>
      </div>
    }>
      <MeetingView />
    </Suspense>
  );
}
