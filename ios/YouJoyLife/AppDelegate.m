/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RCTSplashScreen/RCTSplashScreen.h>

@interface AppDelegate()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  [JPUSHService setupWithOption:launchOptions appKey:appKey
                        channel:nil apsForProduction:nil];
  
  
  NSURL *jsCodeLocation;
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
//  jsCodeLocation = [NSURL URLWithString:@"http://192.168.10.202:8081/index.ios.bundle?platform=ios&dev=true"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"YouJoyLife"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  [RCTSplashScreen show:rootView];//闪屏页
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  [JPUSHService resetBadge];
  self.clickType = @"launchFromKilled";
  [self performSelector:@selector(changeClickType) withObject:nil afterDelay:5];
  
  return YES;
}


- (void)changeClickType{
  self.clickType = @"";
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [JPUSHService registerDeviceToken:deviceToken];
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  
  // Required,For systems with less than or equal to iOS6
  [JPUSHService handleRemoteNotification:userInfo];
  // 取得 APNs 标准信息内容
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  
}

//iOS 7 Remote Notification
//for silent remote notifications(静默推送，用户看不见的推送)
- (void)application:(UIApplication *)application didReceiveRemoteNotification:  (NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  
}

// iOS 10 Support
// app 处于前台状态时收到通知时调用,处于后台时不会调用（作用类似于‘个推’的在线透传）
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  // Required
  NSDictionary * userInfo = notification.request.content.userInfo;
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  [JPUSHService resetBadge];
  completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
}
// iOS 10 Support
// app 处于前台（willPresentNotification方法中的completionHandler设置为UNNotificationPresentationOptionAlert的时候）或后台时点击通知时调用
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  [JPUSHService handleRemoteNotification:userInfo];
  if (self.clickType && [self.clickType isEqualToString:@"launchFromKilled"]) {
    [self performSelector:@selector(sendLaunchNotification:) withObject:userInfo afterDelay:2];
    self.clickType = @"";
  }else{
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }
  completionHandler();// 系统要求执行这个方法
}

- (void)sendLaunchNotification:(NSDictionary *)userInfo{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotificationToLaunchApp object:userInfo];
}

- (void)applicationWillTerminate:(UIApplication *)application{
  NSLog(@"################ app被杀死 ################");
}

- (void)applicationDidEnterBackground:(UIApplication *)application{
  self.clickType = @"";
}

- (void)applicationWillEnterForeground:(UIApplication *)application{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  [JPUSHService resetBadge];
}
@end
