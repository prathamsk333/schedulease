import User from "../model/userModal";
import catchAsync from "../utils/catchAsync";

export const updateUser = catchAsync(async (req: any, res: any) => {
  const newUser = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    phone: req.body.phone || req.user.phone,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUser);
  console.log(user);

  res.status(200).json({        
    status: "success",
    data: {
      user 
    },
  });   

  if (!user) {
    return res.status(404).json({
        status: 'failed',
        message: 'User not found'
    });
  }
});
