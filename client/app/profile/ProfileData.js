const ProfileData = ({ profile }) => {

    return (
        <div className='container h-fit p-6 text-lg flex flex-col'>
            <div className='flex flex-col md:flex-row mb-2'>
                <p className='md:mr-2'>Username:</p>
                <p className='break-words'>{profile?.username}</p>
            </div>
            <div className='flex flex-col md:flex-row mb-2'>
                <p className='md:mr-2'>ID:</p>
                <p>{profile?.id}</p>
            </div>
            <div className='flex flex-col md:flex-row mb-2'>
                <p className='md:mr-2'>Email:</p>
                <p className='break-words'>{profile?.email}</p>
            </div>
            <div className='flex flex-col md:flex-row'>
                <p className='md:mr-2'>Joining Date:</p>
                <p>{profile?.joiningDate?.split('T')[0]}</p>
            </div>
        </div>
    );
};

export default ProfileData;
