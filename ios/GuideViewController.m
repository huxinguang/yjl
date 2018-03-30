//
//  GuideViewController.m
//  YouJoyLife
//
//  Created by huxinguang on 2018/3/30.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GuideViewController.h"

#define kScreenWidth [[UIScreen mainScreen]bounds].size.width
#define kScreenHeight [[UIScreen mainScreen]bounds].size.height

static const int IMAGE_COUNT = 3;

@interface GuideViewController ()<UIScrollViewDelegate>
@property (weak, nonatomic) IBOutlet UIScrollView *guideScrollView;
@property (weak, nonatomic) IBOutlet UIPageControl *pageControl;
@end

@implementation GuideViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.guideScrollView.delegate = self;
    self.guideScrollView.showsHorizontalScrollIndicator = NO;
    self.guideScrollView.pagingEnabled = YES;
    self.guideScrollView.bounces = NO;
    self.guideScrollView.contentSize = CGSizeMake(3*kScreenWidth, kScreenHeight);
  
    self.pageControl.numberOfPages = IMAGE_COUNT;
    self.pageControl.hidesForSinglePage = YES;
    self.pageControl.currentPageIndicatorTintColor = [UIColor purpleColor];
    self.pageControl.currentPage = 0;
  
    for (int i = 0; i < IMAGE_COUNT; i++) {
      UIImageView *imgView = [[UIImageView alloc]init];
      imgView.userInteractionEnabled = YES;
      if (i == 0) {
        imgView.backgroundColor = [UIColor redColor];
      }else if (i == 1){
        imgView.backgroundColor = [UIColor blueColor];
      }else{
        imgView.backgroundColor = [UIColor greenColor];
      }
      
//      imgView.image = [UIImage imageNamed:@"Image-1"];
      imgView.frame = CGRectMake(i*kScreenWidth, 0, kScreenWidth, kScreenHeight);
      if (i == IMAGE_COUNT - 1) {
        UIButton *startBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        startBtn.frame = CGRectMake(60, kScreenHeight - 200, kScreenWidth - 60*2, 40);
        startBtn.backgroundColor = [UIColor whiteColor];
        [startBtn addTarget:self action:@selector(startAction) forControlEvents:UIControlEventTouchUpInside];
        [imgView addSubview:startBtn];
      }
      [self.guideScrollView addSubview:imgView];
    }
}

-(void)startAction{
  if (self.delegate && [self.delegate respondsToSelector:@selector(doSomethingForMe)]) {
    [self.delegate doSomethingForMe];
  }
}

#pragma mark - UIScrollViewDelegate
-(void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView{
  CGPoint offset = scrollView.contentOffset;
  if(offset.x<=0){
    offset.x = 0;
    scrollView.contentOffset = offset;
  }
  NSUInteger index = round(offset.x / scrollView.frame.size.width);
  self.pageControl.currentPage = index;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
