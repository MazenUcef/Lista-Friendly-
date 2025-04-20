import  { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReadPosts } from '../api/postsApi';
import { useAllComments } from '../api/commentApi';
import { useGetUsers } from '../api/authApi';
import { Card } from 'flowbite-react';

const Dashboard = () => {
    const { users, fetchUsers } = useGetUsers();
    const { allComments, fetchAllComments } = useAllComments();
    const { posts, fetchPosts } = useReadPosts();

    useEffect(() => {
        fetchUsers({ startIndex: 0, limit: 10 });
        fetchAllComments();
        fetchPosts();
    }, []);

    const userStats = [
        { name: 'Users', value: users.length },
        { name: 'Comments', value: allComments.length },
        { name: 'Posts', value: posts.length },
    ];

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <motion.h1
                className="text-4xl font-bold col-span-full text-[#71BE63] text-center mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Dashboard Overview
            </motion.h1>

            {userStats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                >
                    <Card className="p-4">
                            <h2 className="text-xl text-[#71BE63] font-semibold">{stat.name}</h2>
                            <p className="text-3xl text-[#71BE63] font-bold">{stat.value}</p>
                    </Card>
                </motion.div>
            ))}

            <motion.div
                className="col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Card className="p-4 h-[300px]">
                        <h2 className="text-xl text-[#71BE63] font-semibold mb-4">User Activity</h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                </Card>
            </motion.div>

            <motion.div
                className="col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
            >
                <Card className="p-4 h-[300px]">
                        <h2 className="text-xl font-semibold text-[#71BE63] mb-4">Posts vs Comments</h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                </Card>
            </motion.div>
        </div>
    );
};

export default Dashboard;
