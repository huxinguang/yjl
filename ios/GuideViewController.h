//
//  GuideViewController.h
//  YouJoyLife
//
//  Created by huxinguang on 2018/3/30.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol GuideDelegate <NSObject>

- (void)doSomethingForMe;

@end

@interface GuideViewController : UIViewController

@property (nonatomic, weak)id<GuideDelegate> delegate;

@end
