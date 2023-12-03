import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {

    const profile = await CurrentProfile();

    if (!profile) redirectToSignIn();
    if (!params.inviteCode) redirect('/');

    const existing = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile?.id
                }
            }
        }
    });

    if (existing) return redirect(`/servers/${ existing.id }`);

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile?.id ? profile.id : ''
                    }
                ]
            }
        }
    });

    if (server) return redirect(`/servers/${ server.id }`);
}

export default InviteCodePage;