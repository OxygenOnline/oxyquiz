const ProfileData = ({ profile }) => {

    return (
        <div className='container h-fit p-6 text-lg'>
            <h2>username: {profile?.username}</h2>
            <p>id: {profile?.id}</p>
            <p>email: {profile?.email}</p>
            <p>joining date: {profile?.joiningDate?.split('T')[0]}</p>
        </div>
    );
};

export default ProfileData;
